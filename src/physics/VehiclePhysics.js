export class VehiclePhysics{
constructor(spec={}){this.spec=spec;this.reset()}
reset(){this.x=0;this.vx=0;this.speed=0;this.heading=0;this.steerAngle=0;this.bodyRoll=0;this.bodyPitch=0;this.suspension=0;this.brake=false}
update(dt,input){
 const steer=input.steer;this.brake=input.brake;
 const max=this.spec.maxSpeed;const throttle=input.accel?1:0;
 const engine=this.spec.accel*(.35+throttle*.65);
 const rolling=this.spec.drag+this.speed*.018;
 if(throttle)this.speed+=engine*dt;
 else this.speed-=rolling*dt;
 if(this.brake)this.speed-=this.spec.brake*dt;
 this.speed=Math.max(0,Math.min(max,this.speed));
 const steerLimit=.58*(1-Math.min(this.speed/max,.85)*.22);
 const targetSteer=steer*steerLimit;
 this.steerAngle+=(targetSteer-this.steerAngle)*Math.min(1,dt*8);
 const wheelBase=2.65;
 const yawRate=(this.speed/3.6)/wheelBase*Math.tan(this.steerAngle)*this.spec.yawGrip;
 this.heading+=yawRate*dt;
 const lateralTarget=Math.sin(this.steerAngle)*this.speed*.0028;
 this.vx+=(lateralTarget-this.vx)*Math.min(1,dt*this.spec.grip);
 this.vx*=Math.pow(.18,dt);
 this.x+=this.vx*dt;
 this.x=Math.max(-1.72,Math.min(1.72,this.x));
 this.bodyRoll+=((-this.steerAngle*this.speed*.0018)-this.bodyRoll)*Math.min(1,dt*7);
 this.bodyPitch+=((this.brake?.06:-this.speed*.00016)-this.bodyPitch)*Math.min(1,dt*8);
 this.suspension=Math.sin(performance.now()*.012)*Math.min(.035,this.speed*.00012);
 return this
}}
export const VEHICLES={
balanced:{name:'BALANCED',maxSpeed:190,accel:52,brake:120,drag:18,grip:5.4,yawGrip:.92,color:0x38d9ff},
speed:{name:'SPEED',maxSpeed:235,accel:70,brake:110,drag:17,grip:4.4,yawGrip:.88,color:0xff4d75},
handling:{name:'HANDLING',maxSpeed:180,accel:48,brake:130,drag:18,grip:7.4,yawGrip:1.05,color:0x65ff9a},
heavy:{name:'HEAVY',maxSpeed:165,accel:42,brake:105,drag:14,grip:4.1,yawGrip:.78,color:0xffb84d},
electric:{name:'ELECTRIC',maxSpeed:210,accel:88,brake:135,drag:12,grip:5.8,yawGrip:.98,color:0xb57aff}
}