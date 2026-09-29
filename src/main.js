import * as THREE from 'three';
import './style.css';
import { Game } from './game/Game.js';

const root=document.getElementById('game-root');
const ui=document.getElementById('ui');
ui.innerHTML=`
<section id="menu" class="screen"><div class="panel">
<div class="kicker">A MEMORY-DRIVEN 3D DRIVING EXPERIENCE</div>
<div class="logo">ROAD<br>ECHO</div>
<div class="tag">The highway remembers what you did.<br><b>Your past becomes the opponent.</b></div>
<div class="actions">
<button class="btn primary" data-action="start">START DRIVE</button>
<button class="btn" data-action="garage">GARAGE</button>
<button class="btn" data-action="settings">SETTINGS</button>
<button class="btn" data-action="how">HOW TO PLAY</button>
</div>
<div class="grid" style="margin-top:12px"><div class="stat"><small>BEST SCORE</small><b id="menu-best">0</b></div><div class="stat"><small>PAST ECHOES</small><b id="menu-echoes">0</b></div></div>
</div></section>
<section id="hud" class="hidden"><div class="hud-row">
<div class="hud-card">SPEED<b id="hud-speed">0 km/h</b></div><div class="hud-card">SCORE<b id="hud-score">000000</b></div><div class="hud-card">DISTANCE<b id="hud-dist">0.0 km</b></div><div class="hud-card">PHASE<b id="hud-phase">RUN 1</b></div>
<div class="hud-actions"><button data-action="pause">Ⅱ</button><button data-action="audio" id="audio-btn">🔊</button></div>
</div></section>
<div id="echo-banner">ECHO DETECTED</div>
<div id="touch"><button class="touch-btn" id="touch-left">◀</button><button class="touch-btn" id="touch-brake">▼</button><button class="touch-btn" id="touch-phase">◇</button><button class="touch-btn" id="touch-right">▶</button></div>
`;
const game=new Game(root,ui);
game.start();
