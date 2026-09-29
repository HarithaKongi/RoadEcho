export class VehiclePhysics{
constructor(spec={}){this.spec=spec;this.x=0;this.vx=0;this.speed=0;this.heading=0;this.brake=false}
reset(){this.x=0;this.vx=0;this.speed=0;this.heading=0;this.brake=false}
update(dt,input){const steer=input.steer;this.brake=input.brake;const target= input.accel?this.spec.maxSpeed:(this.speed>45?this.speed*.995:35);const engine=this.spec.accel*(input.accel?1:0.25);if(this.speed<target)this.speed+=engine*dt;else this.speed-=this.spec.drag*dt;if(input.brake)this.speed-=this.spec.brake*dt;this.speed=Math.max(0,Math.min(this.spec.maxSpeed,this.speed));const grip=this.spec.grip*(1-Math.min(this.speed/this.spec.maxSpeed,.7)*.35);this.vx+=steer*grip*dt;this.vx*=Math.pow(.06,dt);this.x+=this.vx*dt;this.x=Math.max(-1.72,Math.min(1.72,this.x));this.heading+=(steer*.35-this.heading)*Math.min(1,dt*7);return this}}
export const VEHICLES={
balanced:{name:'BALANCED',maxSpeed:190,accel:52,brake:120,drag:18,grip:5.4,color:0x38d9ff},
speed:{name:'SPEED',maxSpeed:235,accel:70,brake:110,drag:17,grip:4.4,color:0xff4d75},
handling:{name:'HANDLING',maxSpeed:180,accel:48,brake:130,drag:18,grip:7.4,color:0x65ff9a},
heavy:{name:'HEAVY',maxSpeed:165,accel:42,brake:105,drag:14,grip:4.1,color:0xffb84d},
electric:{name:'ELECTRIC',maxSpeed:210,accel:88,brake:135,drag:12,grip:5.8,color:0xb57aff}
}