import * as THREE from 'three';
import { loadCarModel, fallbackCar } from './VehicleModel.js';

const LANES = [-4.5, -1.5, 1.5, 4.5];

export class TrafficManager {
  constructor(scene) {
    this.scene = scene;
    this.items = [];
    this.pool = [];
    this.timer = 0;
    this.modelPromise = loadCarModel();
  }

  async make() {
    const g = new THREE.Group();
    const model = await this.modelPromise;

    if (model) {
      const m = model.clone(true);
      m.scale.setScalar(0.72 + Math.random() * 0.18);
      m.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      g.add(m);
    } else {
      g.add(fallbackCar([0xe6ebf2, 0xff4c5f, 0x4f8cff, 0xffc34d, 0x77e0b0][Math.floor(Math.random() * 5)]));
    }

    g.userData.targetLane = 0;
    g.userData.laneChange = 0;
    return g;
  }

  async spawn(playerZ, playerSpeed) {
    const g = this.pool.pop() || await this.make();
    const lane = Math.floor(Math.random() * LANES.length);
    g.position.set(LANES[lane], 0.72, playerZ - 90 - Math.random() * 65);
    g.userData.lane = lane;
    g.userData.targetLane = lane;
    g.userData.speed = 24 + Math.random() * 26;
    g.userData.reaction = 1.2 + Math.random() * 1.4;
    g.userData.cooldown = 1 + Math.random() * 2;
    this.scene.add(g);
    this.items.push(g);
  }

  chooseLane(vehicle) {
    if (vehicle.userData.cooldown > 0) return;

    const current = vehicle.userData.lane;
    const candidates = [current - 1, current + 1].filter((lane) => lane >= 0 && lane < LANES.length);

    if (!candidates.length) return;

    const next = candidates[Math.floor(Math.random() * candidates.length)];
    const blocked = this.items.some((other) => {
      if (other === vehicle || other.userData.lane !== next) return false;
      return Math.abs(other.position.z - vehicle.position.z) < 12;
    });

    if (!blocked && Math.random() < 0.22) {
      vehicle.userData.targetLane = next;
      vehicle.userData.cooldown = 3 + Math.random() * 4;
    }
  }

  update(dt, playerZ, playerSpeed) {
    this.timer -= dt;

    const density = THREE.MathUtils.clamp(playerSpeed / 220, 0, 1);
    if (this.timer <= 0 && this.items.length < 18) {
      this.spawn(playerZ, playerSpeed);
      this.timer = 0.65 + Math.random() * 1.15 - density * 0.2;
    }

    for (let i = this.items.length - 1; i >= 0; i--) {
      const vehicle = this.items[i];
      vehicle.userData.cooldown -= dt;

      const laneTarget = LANES[vehicle.userData.targetLane];
      vehicle.position.x += (laneTarget - vehicle.position.x) * Math.min(1, dt * 1.6);
      vehicle.rotation.y = THREE.MathUtils.lerp(
        vehicle.rotation.y,
        -(laneTarget - vehicle.position.x) * 0.06,
        Math.min(1, dt * 4)
      );

      const relativeSpeed = playerSpeed - vehicle.userData.speed * 3.6;
      vehicle.position.z += relativeSpeed * dt * 0.9;

      if (Math.abs(vehicle.position.z - playerZ) < 28) this.chooseLane(vehicle);

      if (vehicle.position.z > playerZ + 35 || vehicle.position.z < playerZ - 180) {
        this.scene.remove(vehicle);
        this.pool.push(vehicle);
        this.items.splice(i, 1);
      }
    }
  }

  collisions(px, pz) {
    return this.items.some((o) =>
      Math.abs(o.position.x - px) < 1.7 &&
      Math.abs(o.position.z - pz) < 3.2
    );
  }
}
