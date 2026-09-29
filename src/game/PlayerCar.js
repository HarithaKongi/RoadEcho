import * as THREE from 'three';
import {loadCarModel,fallbackCar} from './VehicleModel.js';
export class PlayerCar{
constructor(scene,spec){this.scene=scene;this.group=new THREE.Group();this.spec=spec;this.wheels=[];this.frontWheels=[];this.visualSpeed=0;this.modelReady=false;this.build();scene.add(this.group);this.load()}
build(){this.model=fallbackCar(this.spec.color);this.group.add(this.model);this.group.position.y=.18}
async load(){const model=await loadCarModel();if(!model||!this.group.parent)return;this.group.remove(this.model);this.model=model;this.group.add(model);this.modelReady=true;this.group.scale.setScalar(1.0);this.findWheels()}
findWheels(){this.wheels=[];this.frontWheels=[];this.model.traverse(o=>{if(o.isMesh&&/wheel|tire|tyre/i.test(o.name))this.wheels.push(o);});this.frontWheels=this.wheels.slice(0,2)}
update(p,dt){
  const target=p.speed;this.visualSpeed+=(target-this.visualSpeed)*Math.min(1,dt*7);
  this.group.position.x=p.x*2.15;
  this.group.position.y=.18+p.suspension;
  this.group.rotation.y=p.heading;
  this.group.rotation.z=p.bodyRoll;
  this.group.rotation.x=p.bodyPitch;
  for(const w of this.wheels)w.rotation.x-=this.visualSpeed*dt*.012;
  for(const w of this.frontWheels)w.rotation.y=p.steerAngle*.45;
}
}