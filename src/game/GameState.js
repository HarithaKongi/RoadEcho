export class GameState{
constructor(){this.mode='menu';this.phase=1;this.runTime=0;this.distance=0;this.score=0;this.shards=0;this.speed=0;this.paused=false;this.best=Number(localStorage.getItem('roadEchoBest')||0);this.selectedCar=localStorage.getItem('roadEchoCar')||'balanced';this.audio=localStorage.getItem('roadEchoAudio')!=='off'}
reset(){this.mode='drive';this.phase=1;this.runTime=0;this.distance=0;this.score=0;this.shards=0;this.speed=0;this.paused=false}
saveBest(){this.best=Math.max(this.best,Math.floor(this.score));localStorage.setItem('roadEchoBest',String(this.best))}
}