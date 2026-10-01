import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

const FIXED_DT = 1 / 120;

export class VehiclePhysics {
  constructor(spec = {}) {
    this.spec = spec;
    this.ready = this.initialize();
    this.accumulator = 0;
    this.resetState();
  }

  async initialize() {
    await RAPIER.init();
    this.RAPIER = RAPIER;
    this.world = new RAPIER.World({ x: 0, y: 0, z: 0 });
    this.world.timestep = FIXED_DT;

    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(0, 0.75, 0)
      .setAdditionalMass(this.spec.mass ?? 1350)
      .setLinearDamping(0.08)
      .setAngularDamping(1.8)
      .setCcdEnabled(true)
      .enabledRotations(false, true, false);

    this.body = this.world.createRigidBody(bodyDesc);

    const collider = RAPIER.ColliderDesc.cuboid(0.98, 0.42, 2.05)
      .setFriction(0.95)
      .setRestitution(0.04);
    this.world.createCollider(collider, this.body);

    this.reset();
  }

  resetState() {
    this.x = 0;
    this.z = 0;
    this.speed = 0;
    this.heading = 0;
    this.steerAngle = 0;
    this.bodyRoll = 0;
    this.bodyPitch = 0;
    this.suspension = 0;
    this.brake = false;
    this.throttle = 0;
    this.readyState = false;
  }

  reset() {
    this.resetState();
    if (!this.body) return;
    this.body.setTranslation({ x: 0, y: 0.75, z: 0 }, true);
    this.body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.readyState = true;
  }

  stepPhysics(input, dt) {
    const body = this.body;
    const spec = this.spec;

    const rotation = body.rotation();
    const q = new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(q);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(q);

    const velocity = body.linvel();
    const velocityVec = new THREE.Vector3(velocity.x, velocity.y, velocity.z);
    const forwardSpeed = velocityVec.dot(forward);
    const lateralSpeed = velocityVec.dot(right);

    const targetSteer = input.steer * (0.58 - Math.min(Math.abs(forwardSpeed) / 75, 0.42));
    this.steerAngle += (targetSteer - this.steerAngle) * Math.min(1, dt * 10);

    const throttleTarget = input.accel ? 1 : 0;
    this.throttle += (throttleTarget - this.throttle) * Math.min(1, dt * 7);
    this.brake = Boolean(input.brake);

    const speedKmh = Math.abs(forwardSpeed) * 3.6;
    const engineForce = (spec.engineForce ?? 9200) * this.throttle;
    const brakeForce = this.brake ? (spec.brakeForce ?? 15000) : 0;

    if (forwardSpeed < (spec.maxSpeed ?? 58)) {
      body.applyImpulse({
        x: forward.x * engineForce * dt,
        y: 0,
        z: forward.z * engineForce * dt
      }, true);
    }

    if (this.brake && speedKmh > 0.5) {
      body.applyImpulse({
        x: -forward.x * brakeForce * dt,
        y: 0,
        z: -forward.z * brakeForce * dt
      }, true);
    }

    // Tire lateral friction: the vehicle resists sliding sideways, but does not
    // instantly snap to a lane.
    const lateralGrip = (spec.lateralGrip ?? 7.5) * (this.brake ? 1.08 : 1);
    body.applyImpulse({
      x: -right.x * lateralSpeed * lateralGrip * dt,
      y: 0,
      z: -right.z * lateralSpeed * lateralGrip * dt
    }, true);

    // Speed-sensitive yaw torque creates progressive steering rather than
    // directly changing the vehicle position.
    const steeringAuthority = THREE.MathUtils.clamp(Math.abs(forwardSpeed) / 18, 0, 1);
    const yawTorque = -this.steerAngle * (spec.steeringTorque ?? 5200) * steeringAuthority;
    body.applyTorqueImpulse({ x: 0, y: yawTorque * dt, z: 0 }, true);

    // Aerodynamic drag and rolling resistance.
    const drag = velocityVec.lengthSq() * (spec.drag ?? 0.42);
    if (velocityVec.lengthSq() > 0.01) {
      const dragDir = velocityVec.clone().normalize();
      body.applyImpulse({
        x: -dragDir.x * drag * dt,
        y: 0,
        z: -dragDir.z * drag * dt
      }, true);
    }

    this.world.step();
  }

  update(dt, input) {
    if (!this.body || !this.readyState) return this;

    this.accumulator += Math.min(dt, 0.05);
    let steps = 0;

    while (this.accumulator >= FIXED_DT && steps < 8) {
      this.stepPhysics(input, FIXED_DT);
      this.accumulator -= FIXED_DT;
      steps++;
    }

    const position = this.body.translation();
    const rotation = this.body.rotation();
    const velocity = this.body.linvel();

    this.x = position.x;
    this.z = position.z;
    this.speed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2) * 3.6;
    this.heading = Math.atan2(
      -(2 * (rotation.w * rotation.y + rotation.x * rotation.z)),
      1 - 2 * (rotation.y * rotation.y + rotation.x * rotation.x)
    );

    this.bodyRoll += ((-this.steerAngle * this.speed * 0.0017) - this.bodyRoll) * Math.min(1, dt * 8);
    this.bodyPitch += ((this.brake ? 0.055 : -this.throttle * 0.022) - this.bodyPitch) * Math.min(1, dt * 8);
    this.suspension = Math.sin(performance.now() * 0.012) * Math.min(0.028, this.speed * 0.00009);

    return this;
  }

  getTransform() {
    if (!this.body) return null;
    const p = this.body.translation();
    const r = this.body.rotation();
    return {
      position: { x: p.x, y: p.y, z: p.z },
      rotation: { x: r.x, y: r.y, z: r.z, w: r.w }
    };
  }
}

export const VEHICLES = {
  balanced: {
    name: 'APEX GT',
    maxSpeed: 58,
    mass: 1350,
    engineForce: 9200,
    brakeForce: 15000,
    lateralGrip: 7.5,
    steeringTorque: 5200,
    drag: 0.42,
    color: 0x38d9ff
  },
  speed: {
    name: 'VELOCITY R',
    maxSpeed: 70,
    mass: 1280,
    engineForce: 11200,
    brakeForce: 14500,
    lateralGrip: 6.6,
    steeringTorque: 5000,
    drag: 0.39,
    color: 0xff4d75
  },
  handling: {
    name: 'CURVE RS',
    maxSpeed: 55,
    mass: 1240,
    engineForce: 8500,
    brakeForce: 16800,
    lateralGrip: 9.2,
    steeringTorque: 5700,
    drag: 0.44,
    color: 0x65ff9a
  },
  heavy: {
    name: 'IRON V8',
    maxSpeed: 50,
    mass: 1780,
    engineForce: 10200,
    brakeForce: 17000,
    lateralGrip: 5.6,
    steeringTorque: 4200,
    drag: 0.48,
    color: 0xffb84d
  },
  electric: {
    name: 'EON X',
    maxSpeed: 63,
    mass: 1580,
    engineForce: 12800,
    brakeForce: 19000,
    lateralGrip: 8.0,
    steeringTorque: 5400,
    drag: 0.31,
    color: 0xb57aff
  }
};
