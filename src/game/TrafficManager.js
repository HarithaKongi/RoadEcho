import * as THREE from 'three';
import {loadCarModel,fallbackCar} from './VehicleModel.js';
export class TrafficManager{
constructor(scene){this.scene=scene;this.items=[];this.pool=[];this.timer=0;this.modelPromise=loadCarModel()}
async make(){
 const g=new THREE.Group();const model=await this.modelPromise;
 if(model){const m=model.clone(true);m.scale.setScalar(.72+Math.random()*.18);m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});g.add(m)}
 else g.add(fallbackCar([0xe6ebf2,0xff4c5f,0x4f8cff,0xffc34d,0x77e0b0][Math.floor(Math.random()*5)]));
 return g;
}
async spawn(){const g=this.pool.pop()||await this.make();const lanes=[-1.5,-.5,.5,1.5];g.position.set(lanes[Math.floor(Math.random()*4)]*2.15,.12,-110);g.userData.speed=55+Math.random()*65;g.userData.lane=g.position.x;this.scene.add(g);this.items.push(g)}
update(dt,playerSpeed){this.timer-=dt;if(this.timer<=0){this.spawn();this.timer=1+Math.random()*1.5-Math.min(playerSpeed,180)/900}for(let i=this.items.length-1;i>=0;i--){const o=this.items[i];o.position.z+=(playerSpeed-o.userData.speed)*dt*.08;o.rotation.y+=(o.userData.lane-o.position.x)*dt*.7;if(o.position.z>18||o.position.z<-150){this.scene.remove(o);this.pool.push(o);this.items.splice(i,1)}}}
collisions(px,pz){for(const o of this.items)if(Math.abs(o.position.x-px)<1.7&&Math.abs(o.position.z-pz)<3)return true;return false}
}