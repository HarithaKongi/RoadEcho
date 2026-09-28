# 🚗 ROAD ECHO — The Highway Remembers

> **A memory-driven arcade racing game where your own past becomes your opponent.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-00C7B7?style=for-the-badge)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge\&logo=javascript)](#)
[![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas-orange?style=for-the-badge\&logo=html5)](#)
[![Responsive](https://img.shields.io/badge/UI-Responsive-blue?style=for-the-badge)](#)

---

## 🎮 Project Overview

**ROAD ECHO** is a browser-based arcade driving game built around a different gameplay concept:

> **Your previous driving decisions become the opponent in your next run.**

Instead of using a traditional AI opponent, the game records the player's steering path and transforms that history into a glowing **Echo** that replays the player's previous decisions.

This creates a gameplay loop where the player is effectively competing against their own driving history.

### Core Gameplay Loop

```text
Drive
  ↓
Record Player Route
  ↓
Create Echo
  ↓
Drive Against Your Past
  ↓
Collect Memory Shards
  ↓
Survive Memory Events
  ↓
Create a Better Route
  ↓
Repeat
```

---

## ✨ Key Features

### 🧠 Memory-Based Gameplay

* Records the player's steering decisions during a run.
* Converts the recorded route into an Echo opponent.
* Echo reproduces the player's previous movement pattern.
* Each new run can become more challenging because of the player's own history.

### 🏎️ Arcade Driving

* Real-time steering.
* Progressive speed increase.
* Procedurally spawned traffic.
* Collision detection.
* Distance and score tracking.
* Progressive gameplay phases.

### 🌌 Memory Events

* **Memory Shards** for bonus points.
* **Memory Gates** introduced in later phases.
* **Phase Shift** mechanic.
* Echo collisions and memory-based events.

### 🎮 Multiple Input Methods

**Desktop**

* `A / D`
* `← / →`
* `Space` — Phase Shift
* `P` — Pause
* `M` — Audio toggle

**Mobile**

* Touch steering buttons.
* Drag-based steering.

### 💾 Persistent Game Data

The game uses browser `localStorage` to preserve:

* Best score
* Previous driving route
* Audio preference

No backend or account is required.

### 🔊 Audio Feedback

Uses the browser's **Web Audio API** for lightweight gameplay sound effects without external audio libraries.

### 📱 Responsive Design

Designed to work across:

* Desktop
* Laptop
* Mobile
* Touch devices

---

# 🛠️ Tech Stack

| Technology                 | Purpose                             |
| -------------------------- | ----------------------------------- |
| **HTML5**                  | Application structure               |
| **CSS3**                   | Responsive UI and visual styling    |
| **JavaScript ES6+**        | Game logic and state management     |
| **HTML5 Canvas**           | Real-time game rendering            |
| **Web Audio API**          | Dynamic gameplay sound effects      |
| **LocalStorage API**       | Persistent player data              |
| **Git & GitHub**           | Version control and project hosting |
| **GitHub Pages / Netlify** | Deployment                          |

### Architecture

The project intentionally avoids a heavy game engine and implements the core game systems directly using browser APIs.

```text
Input
 │
 ├── Keyboard
 ├── Touch
 └── Pointer
       │
       ▼
   Game State
       │
       ├── Player Movement
       ├── Collision System
       ├── Object Spawning
       ├── Echo System
       ├── Score System
       └── Phase System
       │
       ▼
 HTML5 Canvas Renderer
       │
       ▼
 Browser
```

---

# 🧠 Technical Highlights

## 1. Echo Replay System

The most important system in ROAD ECHO is the route recorder.

During gameplay, the player's position is periodically stored:

```text
Player Position
      ↓
Route History
      ↓
Saved Route
      ↓
Echo Replay
      ↓
Opponent
```

The Echo uses the recorded route to reproduce previous player movement.

This creates an opponent without requiring a conventional pathfinding or machine-learning system.

---

## 2. Delta-Time Game Loop

The game uses `requestAnimationFrame()` with delta-time based updates.

This keeps movement and gameplay calculations consistent across different frame rates.

```text
requestAnimationFrame
        ↓
Calculate Δ Time
        ↓
Update Game State
        ↓
Update Objects
        ↓
Detect Collisions
        ↓
Render Frame
```

---

## 3. Procedural Object Spawning

Traffic, shards and memory gates are generated dynamically during gameplay.

This prevents every run from following an identical obstacle pattern.

---

## 4. Collision System

The game continuously checks the player's position against approaching objects.

Different object types produce different outcomes:

```text
Traffic → Collision penalty
Echo → Memory collision
Shard → Bonus score
Gate → Bonus score
```

---

## 5. Persistent Progress

Browser `localStorage` is used to preserve player-specific data between sessions.

This allows the game to remember:

```text
Best Score
Previous Route
Audio Preference
```

---

# 📂 Project Structure

```text
RoadEcho/
│
├── index.html
│
├── README.md
│
├── GAME_DESIGN.md
│
├── package.json
│
└── .gitignore
```

The current implementation is intentionally lightweight and can run without installing a game engine or external JavaScript framework.

---

# 🚀 Running Locally

### Option 1 — Direct Browser

Clone the repository:

```bash
git clone https://github.com/HarithaKongi/RoadEcho.git
```

Navigate into the project:

```bash
cd RoadEcho
```

Open:

```text
index.html
```

in Chrome or Microsoft Edge.

---

### Option 2 — VS Code

Open the project in VS Code.

Install the **Live Server** extension.

Then:

```text
Right Click index.html
        ↓
Open with Live Server
```

The game will open in your browser.

---

# 🌐 Deployment

The project is completely frontend-based and can be deployed using:

* GitHub Pages
* Netlify
* Vercel

No backend server is required for the current version.

---

# 📈 Future Development

ROAD ECHO is designed as a foundation that can be expanded into a larger game.

Planned possibilities include:

* 🌐 Global multiplayer leaderboard
* 👻 Multiple generations of Echoes
* 🏆 Daily driving challenges
* 🗺️ Procedurally generated environments
* 🌧️ Dynamic weather
* 🚘 Vehicle customization
* 🎵 Dynamic music system
* 🧠 Advanced Echo behavior
* 📊 Player performance analytics
* 🔁 Replay import/export
* 🌐 Online multiplayer modes
* 🎮 WebGL / Three.js 3D version

---

# 🎯 What This Project Demonstrates

This project demonstrates practical experience with:

* Game-loop architecture
* Real-time rendering
* JavaScript state management
* Collision detection
* Procedural generation
* User input handling
* Touch/mobile interaction
* Browser storage
* Web Audio API
* Responsive UI design
* Performance-conscious animation
* Git/GitHub workflow
* Frontend deployment

---

# 👨‍💻 Developer

**Haritha Kongi**

B.Tech Computer Science & Engineering student

---

## ⭐ Why ROAD ECHO?

Most arcade racing games make the player compete against predefined traffic or AI opponents.

**ROAD ECHO changes the relationship between player and opponent:**

> **The opponent is the player's own history.**

Every run creates the possibility of a different challenge because the road remembers how you drove before.

---

## 📄 License

This project is intended as a personal portfolio and learning project.

