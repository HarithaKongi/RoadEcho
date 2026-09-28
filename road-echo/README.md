# ROAD ECHO — The Highway Remembers

A browser-based arcade driving game where your previous driving route becomes an Echo opponent.

## Core mechanic

1. Start a run.
2. The game records your steering path.
3. After the first phase, that recorded path becomes a glowing Echo car.
4. The Echo repeats the route you created.
5. Later phases add memory gates and shards.
6. Finish the run and your route is saved locally for future runs.

The project is intentionally dependency-free: there is no backend and no external library required.

## Run locally

### Easiest
Open `index.html` in Google Chrome or Microsoft Edge.

### VS Code
1. Open this folder in VS Code.
2. Install the "Live Server" extension if you want hot reload.
3. Right-click `index.html`.
4. Choose **Open with Live Server**.

## Controls

### Desktop
- Left / A — steer left
- Right / D — steer right
- Space — phase shift
- P — pause/resume
- M — audio on/off

### Mobile
- Use the on-screen left/right buttons.
- Drag on the road to steer.

## Save data

The game uses browser `localStorage` for:
- Best score
- Previous route
- Audio preference

No account or server is required.

## GitHub Pages

Upload the contents of this folder to a GitHub repository.

Then:

1. Open repository **Settings**.
2. Open **Pages**.
3. Select **Deploy from a branch**.
4. Select the `main` branch and `/root`.
5. Save.

GitHub will publish `index.html` as the game.

## Project structure

```text
road-echo/
├── index.html
├── README.md
└── .gitignore
```

## Portfolio description

**ROAD ECHO** is a memory-driven arcade racing experiment built with HTML5 Canvas and vanilla JavaScript. The game's central mechanic records the player's steering history and turns that history into a replayable AI-like Echo opponent on subsequent phases. It combines procedural traffic, collision handling, mobile controls, local persistence, progressive difficulty, scoring, particles, audio feedback, and a responsive canvas renderer without external game engines.

## Next development ideas

- Multiple Echo generations
- Ghost replay visualization
- Procedural city environments
- Garage/custom cars
- Daily seed challenges
- Global leaderboard with a backend
- WebGL/Three.js 3D version
- Replay export/import
- Weather systems
- Boss Echo runs
