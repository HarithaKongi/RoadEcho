# ROAD ECHO — The Highway Remembers

A browser-based 3D driving game where your own past becomes the opponent. Every completed run records steering, speed, position and braking. Later runs replay saved routes as translucent Echo vehicles.

## Gameplay

Drive → record your route → survive traffic → encounter your past → collect memory events → finish → save the route → race the next memory.

The game supports up to three saved Echo generations in localStorage. Echo collisions reduce score and trigger audio/visual feedback.

## Features

- Three.js/WebGL third-person driving
- Procedural 3D highway with lanes, shoulders, guardrails, signs, trees, bridges and reusable road segments
- Physics-inspired acceleration, braking, momentum, steering, grip and vehicle-specific handling
- Five functional vehicles: Balanced, Speed, Handling, Heavy and Electric
- Cars with wheels, windows, headlights and brake lights
- Procedural traffic with cars/SUV-style vehicles and variable speeds
- Echo route recording/replay with multiple generations
- Memory shards, memory gates and Phase Shift
- Day/night cycle, rain, fog and storm conditions
- Web Audio engine and gameplay feedback
- Desktop keyboard + mobile touch controls
- Persistent best score, vehicle, audio preference and Echo routes
- Vite build for Vercel, Netlify and GitHub Pages

## Tech Stack

Three.js · WebGL · JavaScript ES modules · Vite · HTML5 · CSS3 · Web Audio API · localStorage

## Architecture

src/main.js boots the application. Game orchestration lives in src/game/Game.js; physics is isolated in src/physics/VehiclePhysics.js; procedural road/world generation is in src/world/World.js; HUD and menus are in src/ui/HUD.js.

Key systems: GameState, InputManager, PlayerCar, EchoSystem, TrafficManager, WeatherSystem, CameraController and AudioManager.

## Controls

| Action | Desktop | Mobile |
|---|---|---|
| Accelerate | W / ↑ | Automatic |
| Brake / reverse | S / ↓ | Brake button |
| Steer | A/D or ←/→ | Left/right |
| Phase Shift | Space | ◇ |
| Pause | P | HUD button |
| Audio | M | HUD button |

## Run locally

    npm install
    npm run dev

Open the Vite URL shown in the terminal.

## Production build

    npm run build
    npm run preview

The production output is dist/.

## Deployment

- Vercel: import the repository; framework preset Vite; build command npm run build; output directory dist.
- Netlify: build npm run build; publish dist/.
- GitHub Pages: the included workflow installs dependencies, builds with the /RoadEcho/ base path and publishes dist/.

## Screenshots

_Add portfolio screenshots here after capturing desktop and mobile gameplay._

## Technical challenges

The central challenge is making a replay of a player's past feel like a physical opponent while keeping the route compact and deterministic. Routes are sampled at fixed intervals and interpolated during Echo playback. The world uses reusable road segments and bounded traffic/particle counts instead of generating an unbounded scene.

## What I learned

This project demonstrates modular browser-game architecture, real-time WebGL rendering, delta-time physics, procedural world generation, replay systems, responsive input, audio synthesis and client-side persistence.

## Roadmap

Future upgrades can add authored GLB vehicles, richer road materials, stronger lane-changing AI, replay visualization, online leaderboards and more detailed weather/lighting.

## License

Personal portfolio / learning project by Haritha Kongi.
