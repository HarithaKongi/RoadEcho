import * as THREE from 'three';

export class EchoSystem {
  constructor(scene, banner) {
    this.scene = scene;
    this.banner = banner;
    this.routes = [];
    this.ghosts = [];
    this.active = false;
    this.time = 0;
    this.load();
  }

  count() {
    return this.routes.length;
  }

  load() {
    try {
      this.routes = JSON.parse(localStorage.getItem('roadEchoRoutes') || '[]');
    } catch {
      this.routes = [];
    }
  }

  save(route) {
    if (route.length < 20) return;
    this.routes.unshift(route.slice(-1800));
    this.routes = this.routes.slice(0, 3);
    try {
      localStorage.setItem('roadEchoRoutes', JSON.stringify(this.routes));
    } catch {}
  }

  createGhost(route, offset) {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: 0x48efff,
      emissive: 0x19dfff,
      emissiveIntensity: 2,
      transparent: true,
      opacity: 0.38,
      roughness: 0.2
    });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.6, 4.2), mat);
    body.position.y = 0.75;
    g.add(body);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.18, 0.025, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0x48efff, transparent: true, opacity: 0.7 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.45;
    g.add(ring);

    g.userData = { route, offset };
    this.scene.add(g);
    this.ghosts.push(g);
  }

  begin() {
    this.ghosts.forEach((g) => this.scene.remove(g));
    this.ghosts = [];
    this.time = 0;
    this.active = this.routes.length > 0;
    this.routes.slice(0, 3).forEach((route, i) => this.createGhost(route, i));

    if (this.active) {
      this.banner.style.opacity = '1';
      setTimeout(() => { this.banner.style.opacity = '0'; }, 1400);
    }
  }

  update() {
    if (!this.active) return;

    for (const ghost of this.ghosts) {
      const route = ghost.userData.route;
      if (!route?.length) continue;

      const duration = route[route.length - 1].t;
      const t = Math.min(this.time, duration);
      let lo = 0;
      let hi = route.length - 1;

      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (route[mid].t < t) lo = mid + 1;
        else hi = mid;
      }

      const p = route[Math.max(0, lo - 1)];
      const n = route[Math.min(route.length - 1, lo)];
      const alpha = n.t === p.t ? 0 : (t - p.t) / (n.t - p.t);

      ghost.position.x = THREE.MathUtils.lerp(p.x, n.x, alpha);
      ghost.position.z = THREE.MathUtils.lerp(p.z, n.z, alpha);
      ghost.rotation.y = THREE.MathUtils.lerp(p.heading || 0, n.heading || 0, alpha);
      ghost.position.y = 0.75 + Math.sin(this.time * 3 + ghost.userData.offset) * 0.03;
    }

    this.time += 1 / 60;
  }
}
