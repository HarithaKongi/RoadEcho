import * as THREE from 'three';

export class CameraController {
  constructor(camera) {
    this.camera = camera;
    this.baseFov = 67;
    this.currentMode = 'chase';
    this.position = new THREE.Vector3(0, 3.6, 8.5);
    this.look = new THREE.Vector3();
  }

  setMode(mode) {
    this.currentMode = mode;
  }

  update(dt, car, speed, shake = 0) {
    const speedFactor = Math.min(speed / 220, 1);
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(car.quaternion);

    let target;
    if (this.currentMode === 'hood') {
      target = car.position.clone()
        .add(new THREE.Vector3(0, 1.35, 0))
        .add(forward.clone().multiplyScalar(1.15));
    } else if (this.currentMode === 'cockpit') {
      target = car.position.clone()
        .add(new THREE.Vector3(0, 1.25, 0))
        .add(forward.clone().multiplyScalar(0.35));
    } else {
      target = car.position.clone()
        .add(new THREE.Vector3(0, 3.2 + speedFactor * 1.4, 0))
        .add(forward.clone().multiplyScalar(-8.5 - speedFactor * 2.2));
    }

    this.position.lerp(target, 1 - Math.pow(0.001, dt));
    this.camera.position.copy(this.position);

    const lookTarget = car.position.clone()
      .add(new THREE.Vector3(0, 0.9, 0))
      .add(forward.clone().multiplyScalar(10 + speedFactor * 8));

    this.look.lerp(lookTarget, 1 - Math.pow(0.002, dt));
    this.camera.lookAt(this.look);

    this.camera.fov = this.baseFov + speedFactor * 11;
    this.camera.updateProjectionMatrix();

    if (shake > 0) {
      this.camera.position.x += (Math.random() - 0.5) * shake;
      this.camera.position.y += (Math.random() - 0.5) * shake;
    }
  }
}
