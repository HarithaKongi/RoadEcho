import * as THREE from 'three';
import { GameState } from './GameState.js';
import { InputManager } from './InputManager.js';
import { VehiclePhysics, VEHICLES } from '../physics/VehiclePhysics.js';
import { PlayerCar } from './PlayerCar.js';
import { EchoSystem } from './EchoSystem.js';
import { TrafficManager } from './TrafficManager.js';
import { World } from '../world/World.js';
import { WeatherSystem } from './WeatherSystem.js';
import { CameraController } from './CameraController.js';
import { AudioManager } from './AudioManager.js';
import { HUD } from '../ui/HUD.js';

export class Game {
  constructor(root, ui) {
    this.root = root;
    this.ui = ui;
    this.state = new GameState();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050812);
    this.camera = new THREE.PerspectiveCamera(67, innerWidth / innerHeight, 0.05, 700);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    root.appendChild(this.renderer.domElement);

    this.input = new InputManager(ui);
    this.audio = new AudioManager();
    this.hud = new HUD(ui, this);
    this.world = new World(this.scene);
    this.weather = new WeatherSystem(this.scene, this.camera);
    this.cameraCtl = new CameraController(this.camera);
    this.echo = new EchoSystem(this.scene, ui.querySelector('#echo-banner'));
    this.traffic = new TrafficManager(this.scene);
    this.physics = new VehiclePhysics(VEHICLES[this.state.selectedCar]);
    this.car = new PlayerCar(this.scene, VEHICLES[this.state.selectedCar]);

    this.running = false;
    this.last = performance.now();
    this.shake = 0;
    this.route = [];
    this.routeTimer = 0;
    this.weatherClock = 0;
    addEventListener('resize', () => this.resize());
  }

  start() {
    this.hud.showMenu();
    this.running = true;
    requestAnimationFrame((t) => this.loop(t));
  }

  resize() {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
  }

  async startRun() {
    this.state.reset();
    this.route = [];
    this.routeTimer = 0;
    this.weatherClock = 0;

    this.physics = new VehiclePhysics(VEHICLES[this.state.selectedCar]);
    await this.physics.ready;
    this.physics.reset();

    this.car.spec = VEHICLES[this.state.selectedCar];
    this.car.group.position.set(0, 0.72, 0);
    this.echo.begin();
    this.hud.showHUD();
    this.audio.init();
    this.last = performance.now();
  }

  togglePause() {
    if (this.state.mode === 'drive') {
      this.state.mode = 'pause';
      this.hud.hud.classList.add('hidden');
    } else if (this.state.mode === 'pause') {
      this.state.mode = 'drive';
      this.hud.showHUD();
      this.last = performance.now();
    }
  }

  toggleAudio() {
    this.audio.toggle();
    this.ui.querySelector('#audio-btn').textContent = this.audio.enabled ? '🔊' : '🔇';
  }

  showGarage() {
    this.modal('GARAGE', Object.entries(VEHICLES).map(([id, v]) =>
      `<button class="option ${id === this.state.selectedCar ? 'selected' : ''}" data-car="${id}">
        <b>${v.name}</b><br>
        <span class="muted">Top ${Math.round(v.maxSpeed * 3.6)} km/h · Mass ${v.mass} kg · Grip ${v.lateralGrip}</span>
      </button>`
    ).join(''), true);
  }

  showSettings() {
    this.modal('SETTINGS',
      `<div class="option"><b>REAL-TIME VEHICLE PHYSICS</b><p class="muted">Rapier rigid-body dynamics, progressive steering, tire lateral friction, braking and aerodynamic drag.</p></div>
       <div class="option"><b>WORLD</b><p class="muted">World-anchored highway, dynamic traffic, weather and day/night lighting.</p></div>`
    );
  }

  showSummary() {
    this.modal('RUN SUMMARY',
      `<div class="grid">
        <div class="stat"><small>SCORE</small><b>${Math.floor(this.state.score)}</b></div>
        <div class="stat"><small>DISTANCE</small><b>${this.state.distance.toFixed(1)} km</b></div>
        <div class="stat"><small>MEMORY SHARDS</small><b>${this.state.shards}</b></div>
        <div class="stat"><small>ECHOES SAVED</small><b>${this.echo.count()}</b></div>
      </div>
      <p class="muted">Your driving line is now part of the road's memory. Start another run to race against it.</p>
      <button class="btn primary" data-next>START NEXT RUN</button>`
    );
  }

  showHow() {
    this.modal('HOW TO PLAY',
      `<div class="option"><b>DRIVE</b><p class="muted">W / ↑ throttle · S / ↓ brake · A/D or ←/→ steer · P pause · Space Phase Shift.</p></div>
       <div class="option"><b>REAL VEHICLE</b><p class="muted">The car is a 3D rigid body. Steering changes yaw through physics, while tire friction resists lateral sliding.</p></div>
       <div class="option"><b>THE MEMORY</b><p class="muted">Your previous driving lines return as Echo vehicles. Your past becomes the opponent.</p></div>`
    );
  }

  modal(title, body) {
    document.querySelector('.modal')?.remove();
    const m = document.createElement('div');
    m.className = 'modal';
    m.innerHTML = `<div class="panel">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h2>${title}</h2><button class="btn" data-close>×</button>
      </div>
      <div class="actions">${body}</div>
    </div>`;
    document.body.appendChild(m);

    m.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) m.remove();
      if (e.target.closest('[data-next]')) {
        m.remove();
        this.startRun();
      }
      const car = e.target.closest('[data-car]')?.dataset.car;
      if (car) {
        this.state.selectedCar = car;
        localStorage.setItem('roadEchoCar', car);
        m.remove();
        this.showGarage();
      }
    });
  }

  finish() {
    this.state.mode = 'summary';
    this.state.saveBest();
    this.echo.save(this.route);
    this.showSummary();
  }

  update(dt) {
    if (this.state.mode !== 'drive') return;
    if (!this.physics.readyState) return;

    const input = {
      steer: this.input.steer(),
      accel: this.input.accel,
      brake: this.input.brake
    };

    this.physics.update(dt, input);
    this.state.speed = this.physics.speed;
    this.state.distance += this.physics.speed * dt / 3600;
    this.state.runTime += dt;
    this.state.score += this.physics.speed * dt * 0.18;

    this.routeTimer += dt;
    if (this.routeTimer >= 0.08) {
      this.routeTimer = 0;
      this.route.push({
        t: this.state.runTime,
        x: this.physics.x,
        z: this.physics.z,
        heading: this.physics.heading,
        speed: this.physics.speed,
        brake: this.physics.brake
      });
      if (this.route.length > 1800) this.route.shift();
    }

    if (this.state.runTime > 20 && this.state.phase === 1) {
      this.state.phase = 2;
      this.echo.begin();
      this.audio.beep(720, 0.12);
    }

    if (this.state.runTime > 45 && this.state.phase === 2) {
      this.state.phase = 3;
      this.audio.beep(840, 0.12);
    }

    this.weatherClock += dt;
    if (this.weatherClock > 24) {
      this.weatherClock = 0;
      const types = ['clear', 'rain', 'fog', 'storm'];
      this.weather.set(types[Math.floor((this.state.runTime / 24) % types.length)]);
    }

    this.world.update();
    this.traffic.update(dt, this.physics.z, this.physics.speed);
    this.echo.update(dt, this.physics.speed);
    this.car.update(this.physics, dt);

    if (this.traffic.collisions(this.physics.x, this.physics.z)) {
      this.state.score = Math.max(0, this.state.score - 200);
      this.shake = 0.35;
      this.audio.beep(90, 0.14);
    }

    if (this.input.consume('phase')) {
      this.state.score += 100;
      this.shake = 0.18;
      this.audio.beep(900, 0.1);
    }

    if (this.input.consume('pause')) this.togglePause();

    this.audio.engineSound(this.physics.speed);
    this.hud.update(this.state);

    if (this.state.runTime > 75 || this.state.distance > 3) this.finish();
  }

  loop(now) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.update(dt);
    this.cameraCtl.update(dt, this.car.group, this.physics.speed, this.shake);
    this.shake = Math.max(0, this.shake - dt);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame((t) => this.loop(t));
  }
}
