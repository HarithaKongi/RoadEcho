export class HUD{
constructor(ui,game){this.ui=ui;this.game=game;this.menu=ui.querySelector('#menu');this.hud=ui.querySelector('#hud');this.bind()}
bind(){this.ui.addEventListener('click',e=>{const a=e.target.closest('[data-action]')?.dataset.action;if(!a)return;if(a==='start')this.game.startRun();if(a==='pause')this.game.togglePause();if(a==='audio')this.game.toggleAudio();if(a==='garage')this.game.showGarage();if(a==='settings')this.game.showSettings();if(a==='how')this.game.showHow()})}
showMenu(){this.menu.classList.remove('hidden');this.hud.classList.add('hidden');this.ui.querySelector('#menu-best').textContent=this.game.state.best;this.ui.querySelector('#menu-echoes').textContent=this.game.echo.count()}
showHUD(){this.menu.classList.add('hidden');this.hud.classList.remove('hidden')}
update(s){this.ui.querySelector('#hud-speed').textContent=Math.round(s.speed)+' km/h';this.ui.querySelector('#hud-score').textContent=String(Math.floor(s.score)).padStart(6,'0');this.ui.querySelector('#hud-dist').textContent=s.distance.toFixed(1)+' km';this.ui.querySelector('#hud-phase').textContent='RUN '+s.phase}
}