import * as THREE from 'three';

export class World {
  constructor(scene) {
    this.scene = scene;
    this.segments = [];
    this.roadLength = 12;
    this.build();
  }

  build() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(900, 900),
      new THREE.MeshStandardMaterial({ color: 0x07100b, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.position.z = -150;
    this.scene.add(ground);

    for (let i = 0; i < 42; i++) this.addSegment(i);
  }

  addSegment(i) {
    const g = new THREE.Group();
    g.position.z = -i * this.roadLength;

    const curve = Math.sin(i * 0.47) * 0.018;
    g.rotation.y = curve;

    const road = new THREE.Mesh(
      new THREE.BoxGeometry(13.5, 0.18, this.roadLength),
      new THREE.MeshStandardMaterial({ color: 0x252a30, roughness: 0.88, metalness: 0.05 })
    );
    g.add(road);

    for (const x of [-6.8, 6.8]) {
      const shoulder = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.24, this.roadLength),
        new THREE.MeshStandardMaterial({ color: 0x3b4045, roughness: 0.82 })
      );
      shoulder.position.set(x, 0.08, 0);
      g.add(shoulder);

      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.72, this.roadLength),
        new THREE.MeshStandardMaterial({ color: 0x7b8791, metalness: 0.72, roughness: 0.32 })
      );
      rail.position.set(x * 1.03, 0.46, 0);
      g.add(rail);
    }

    for (const x of [-3, 0, 3]) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.025, 2.7),
        new THREE.MeshBasicMaterial({ color: 0xf2f4e9 })
      );
      line.position.set(x, 0.11, 0);
      g.add(line);
    }

    for (const side of [-1, 1]) {
      if (i % 3 === 0) {
        const pole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.06, 3.8, 8),
          new THREE.MeshStandardMaterial({ color: 0x59616a, metalness: 0.8, roughness: 0.3 })
        );
        pole.position.set(side * 9.2, 1.9, 0);
        g.add(pole);

        const lamp = new THREE.Mesh(
          new THREE.SphereGeometry(0.16, 10, 8),
          new THREE.MeshStandardMaterial({
            color: 0xeaf7ff,
            emissive: 0x91d9ff,
            emissiveIntensity: 2.8
          })
        );
        lamp.position.set(side * 9.2, 3.7, 0);
        g.add(lamp);
      }

      if (i % 4 === 1) {
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.17, 1.5, 8),
          new THREE.MeshStandardMaterial({ color: 0x3c2a1e })
        );
        trunk.position.set(side * (9 + (i % 2)), 0.75, 0);
        g.add(trunk);

        const crown = new THREE.Mesh(
          new THREE.SphereGeometry(1.0, 8, 6),
          new THREE.MeshStandardMaterial({ color: 0x12361d, roughness: 1 })
        );
        crown.position.set(trunk.position.x, 2.0, 0);
        g.add(crown);
      }
    }

    if (i % 8 === 3) {
      const sign = new THREE.Mesh(
        new THREE.BoxGeometry(4, 1.5, 0.08),
        new THREE.MeshStandardMaterial({
          color: 0x0c3f55,
          emissive: 0x062d3d,
          emissiveIntensity: 0.7,
          metalness: 0.2
        })
      );
      sign.position.set(-8.2, 3.5, 0);
      g.add(sign);
    }

    this.scene.add(g);
    this.segments.push(g);
  }

  update() {
    // Road segments remain world-anchored; the player and traffic now move
    // through the actual 3D world instead of the world being teleported around them.
  }
}
