

const lineColor = '#383838';

var DoublePendulum = function(
  canvas,
  callback,
  props
){

  this.bound = {left:0,top:0,right:window.outerWidth,bottom:window.outerHeight};
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.anim = null;
  this.stopped = null;
  this.init(props);

}

DoublePendulum.prototype.init = function(props){

  if(typeof window === 'undefined') return;
  this.stopped = false;

  const {
    m1,l1,a1,m2,l2,a2,
    center,gravity,friction
  } = props || {};

  this.canvas.width = window.outerWidth;
  this.canvas.height = window.outerHeight;

  // m = mass
  // l = length
  // a = accel
  // center

  this.l1 = l1 || Math.min(window.outerWidth, window.outerHeight) / 10;
  this.l2 = l2 || Math.min(window.outerWidth, window.outerHeight) / 5;
  this.m1 = m1 || 9;
  this.m2 = m2 || 3;
  this.a1 = a1 || Math.PI * 1.5 + Math.random() * 1;
  this.a2 = a2 || Math.PI * 1.5 + Math.random() * 1;
  this.gravity = gravity || .5
  this.friction = friction || .6

  this.center = center || {
    x: 0,
    y: 0
  };

  this.acc1 = 0;
  this.acc2 = 0;
  this.vel1 = 0;
  this.vel2 = 0;

  this.x1 = this.center.x + this.l1 * Math.cos(this.a1);
  this.y1 = this.center.y + this.l1 * Math.sin(this.a1);

  this.x2 = this.x1 + this.l2 * Math.cos(this.a2);
  this.y2 = this.y1 + this.l2 * Math.sin(this.a2);

  this.maxItt = 4000;
  this.itt = 0
  this.stop = false;

  this.context.fillStyle = '#000000';
  this.context.fillRect(0,0,window.outerWidth,window.outerHeight);
  this.context.translate((window.outerWidth/2)-.5,(window.outerHeight/2)-.5)
  this.context.strokeStyle = lineColor;

  if(!this.anim) this.draw();

}

DoublePendulum.prototype.update = function(){

  var g = this.gravity;
  var ag1 = this.a1 - Math.PI/2;
  var ag2 = this.a2 - Math.PI/2;

  this.acc1 = -g * (2*this.m1 + this.m2) * Math.sin(ag1) - this.m2 * g * Math.sin(ag1 - 2*ag2);
  this.acc1 -= 2 * Math.sin(ag1 - ag2) * this.m2 * (Math.pow(this.vel2,2) * this.l2 + Math.pow(this.vel1,2) * this.l1 * Math.cos(ag1 - ag2));
  this.acc1 /= this.l1 * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2 *ag1 - 2 *ag2));

  this.vel1 += this.acc1;
  this.a1 += this.vel1;

  this.acc2 = 2 * Math.sin(ag1 - ag2);
  this.acc2 *= Math.pow(this.vel1,2) * this.l1 * (this.m1 + this.m2) + g *( this.m1 + this.m2) * Math.cos(ag1) + Math.pow(this.vel2,2) * this.l2 * this.m2 * Math.cos(ag1 - ag2);
  this.acc2 /= this.l2 * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * ag1 - 2 * ag2));

  this.vel2 += this.acc2;
  this.a2 += this.vel2;

  this.x1 = this.center.x + this.l1 * Math.cos(this.a1);
  this.y1 = this.center.y + this.l1 * Math.sin(this.a1);

  this.x2 = this.x1 + this.l2 * Math.cos(this.a2);
  this.y2 = this.y1 + this.l2 * Math.sin(this.a2);

  // this.line.push([this.x2*1,this.y2*1]);
}

DoublePendulum.prototype.draw = function(){

  if(this.stopped) return;
  if(this.itt > this.maxItt){
    this.anim = null;
    return;
  }

  this.context.moveTo(this.x2,this.y2);
  for(let i=0; i<8; i++){
    this.update();
    this.context.lineTo(this.x2,this.y2);
    this.context.stroke();
    this.itt++;
  }

  if(this.anim) cancelAnimationFrame(this.anim)
  this.anim = requestAnimationFrame(() => this.draw());

  // if(this.line.length){
  //
  //   this.context.beginPath();
  //   var l = this.line.slice(this.linelength*this.itt);
  //   this.context.moveTo(l[0][0],l[0][1]);
  //
  //   for(let i in l){
  //     if(!(i*1)) continue;
  //     this.context.lineTo(l[i][0],l[i][1]);
  //   }
  //
  //   this.context.stroke();
  //   this.itt++;
  //
  // }

  // for(let i=0;i<this.linelength;i++)
  //   this.update();

  // if(this.line.length < this.linenum && !this.stop)
  //   this.anim = requestAnimationFrame(() => this.draw());
  // else {
  //   cancelAnimationFrame(this.anim);
  //   this.callback && this.callback(this.canvas.toDataURL());
  // }
}

DoublePendulum.prototype.stop = function(){
  this.stopped = true
}

const Pendulum = function( canvas, callback ){
  if(typeof window === 'undefined') return;

  return new DoublePendulum(
    canvas,
    callback,
    {}
  );

}

export default Pendulum
