import * as THREE from 'three';
import { loadCarModel, fallbackCar } from './VehicleModel.js';

export class PlayerCar {
  constructor(scene, spec) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.spec = spec;
    this.wheels = [];
    this.frontWheels = [];
    this.visualSpeed = 0;
    this.modelReady = false;
    this.build();
    scene.add(this.group);
    this.load();
  }

  build() {
    this.model = fallbackCar(this.spec.color);
    this.group.add(this.model);
    this.group.position.y = 0.72;
  }

  async load() {
    const model = await loadCarModel();
    if (!model || !this.group.parent) return;
    this.group.remove(this.model);
    this.model = model;
    this.group.add(model);
    this.modelReady = true;
    this.group.scale.setScalar(1.0);
    this.findWheels();
  }

  findWheels() {
    this.wheels = [];
    this.frontWheels = [];
    this.model.traverse((o) => {
      if (o.isMesh && /wheel|tire|tyre/i.test(o.name)) this.wheels.push(o);
    });
    this.frontWheels = this.wheels.slice(0, 2);
  }

  update(physics, dt) {
    const targetSpeed = physics.speed;
    this.visualSpeed += (targetSpeed - this.visualSpeed) * Math.min(1, dt * 8);

    this.group.position.set(physics.x, 0.72 + physics.suspension, physics.z);
    this.group.rotation.y = physics.heading;
    this.group.rotation.z = physics.bodyRoll;
    this.group.rotation.x = physics.bodyPitch;

    const wheelSpin = this.visualSpeed * dt * 0.012;
    for (const wheel of this.wheels) wheel.rotation.x -= wheelSpin;
    for (const wheel of this.frontWheels) wheel.rotation.y = physics.steerAngle * 0.65;
  }
}
