

const flockNum = 1;
const ease = 1000;
const minDistance = 21;
const boidWidth = 4;
const maxVelocity = 21;

// aux
const vectorAdd = function(){
  let v = [arguments[0][0],arguments[0][1]]
  for(let i=1;i<arguments.length;i++){
    v[0] += arguments[i][0]
    v[1] += arguments[i][1]
  }
  return v;
}

const vectorMin = function(){
  let v = [arguments[0][0],arguments[0][1]]
  for(let i=1;i<arguments.length;i++){
    v[0] -= arguments[i][0]
    v[1] -= arguments[i][1]
  }
  return v;
}

const vectorDiv = (v1,a) => [v1[0] ? v1[0]/a : 0, v1[1] ? v1[1]/a : 0];
const vectorProd = (v1,a) => [v1[0]*a, v1[1]*a];

const distance = (p1, p2) => {
  var a = p1[0] - p2[0];
  var b = p1[1] - p2[1];

  return Math.sqrt( a*a + b*b );
}


//// rules

// Rule 1: Boids try to fly towards the centre of mass.
const rule1 = (flock, i) => {

  const localEase = 5

  let center = vectorDiv(
   flock.boids.reduce((a,b,idx) => {
     return idx === i ? a : vectorAdd(a, b.pos)
   },[0,0]),
   flock.boids.length-1
  )

  return vectorDiv(
    vectorMin(
      center,
      flock.boids[i].pos
    ),
    // ease
    flock.boids[i].ease * localEase
  )
}

// Rule 2: Boids try to keep a small distance away from other objects (including other boids).
const rule2 = (flock, i) => {

  const boid = flock.boids[i];
  const localEase = 10;

  return flock.boids.reduce((a,b,idx) => {

    if(idx === i) return a;

    const d = distance(b.pos, boid.pos)

    const x = d < minDistance ?
      (boid.pos[0] - b.pos[0])/localEase : a[0];

    const y = d < minDistance ?
      (boid.pos[1] - b.pos[1])/localEase : a[1];

    return [x,y]

  },[0,0])

}

// Rule 3: Boids try to match velocity with near boids.
const rule3 = (flock, i) => {
  let sumVel = flock.boids.reduce((a,b,idx) => {
    return idx === i ? a : vectorAdd(a, b.v)
  },[0,0])

  const localEase = 21;

  return vectorDiv(
    vectorMin(
      vectorDiv(sumVel, flock.boids.length-1),
      flock.boids[i].v
    ),
    // flock.boids[i].ease
    localEase
  )
}

// rule 4: boids tends to go to center of screen
const rule4 = (flock, i) => {

  const localEase = flock.boids[i].ease

  return vectorDiv(
    vectorMin(
      flock.center,
      flock.boids[i].pos
    ),
    localEase
  )
}

// rule 4.1: boids avoid center of screen
const rule41 = (flock, i) => {

  const localEase = flock.boids[i].ease * 0.01
  const boid = flock.boids[i]
  const center = flock.center
  const radius = 144

  const d = distance(center, boid.pos)

  const x = d < radius ?
    4 * (boid.pos[0] - center[0]) / localEase : 0;

  const y = d < radius ?
    4 * (boid.pos[1] - center[1]) / localEase : 0;

  return [x,y]

}

// rule 5: boids stay on screen
const rule5 = (flock, i) => {

  const bounds = [
    -(window.outerWidth/2),
    -(window.outerHeight/2),
    (window.outerWidth/2),
    (window.outerHeight/2),
  ]

  let x = 0, y = 0;

  if(flock.boids[i].pos[0]<bounds[0])
    x = 5;
  if(flock.boids[i].pos[0]>bounds[2])
    x = -5;
  if(flock.boids[i].pos[1]<bounds[1])
    y = 5;
  if(flock.boids[i].pos[1]>bounds[3])
    y = -5;

  return [x,y]
}

// rule 6: boids tends to go to it's own center
const rule6 = (flock, i) => {

  return vectorDiv(
    vectorMin(
      flock.boids[i].center,
      flock.boids[i].pos
    ),
    flock.boids[i].ease
  )
}




// Flock
const Flock = function( center ){
  this.boids = [];
  this.center = center;
  const flockMember = typeof window === 'undefined' ? 256 : Math.max(window.outerWidth, window.outerHeight) / 4;

  for(let i=0;i<flockMember;i++){
    this.boids.push({
      v: [0,0],
      pos: [
        Math.random() * (window.outerWidth/2) * (Math.random()<0.5?-1:1),
        Math.random() * (window.outerHeight/2) * (Math.random()<0.5?-1:1)
      ],
      color: '#' + (
        ( ( 128 + Math.round( Math.random()*(254-128) ) ) << 16) |
        ( ( 128 + Math.round( Math.random()*(254-128) ) ) << 8) |
        ( 128 + Math.round( Math.random()*(254-128) ) )
      ).toString(16),
      size: 1 + (Math.round( Math.random() * boidWidth )),
      ease: (Math.round(Math.random() * ease)) + (Math.round(Math.random() * ease)),
      center: [
        -window.outerWidth + (Math.random()*(window.outerWidth*2)),
        (Math.random()*(window.outerHeight/2)) * (Math.random()<.5?-1:1)
      ]
    })
  }

}

Flock.prototype.calculate = function(){

  let v1,v2,v3,v4;
  for(let i=0;i<this.boids.length;i++){

    this.boids[i].v = vectorAdd(
      this.boids[i].v,
      rule1(this, i),
      rule2(this, i),
      rule3(this, i),
      rule4(this, i),
      rule41(this, i),
      rule5(this, i),
      // rule6(this, i),
    )

    // if(Math.abs(this.boids[i].v[0]) > maxVelocity)
    //   this.boids[i].v[0] = this.boids[i].v[0] * 0.1
    // if(Math.abs(this.boids[i].v[1]) > maxVelocity)
    //   this.boids[i].v[1] = this.boids[i].v[1] * 0.1

    //
    // // const old = [ this.boids[i].pos[0], this.boids[i].pos[1] ]
    this.boids[i].pos = vectorAdd(
      this.boids[i].pos,
      this.boids[i].v
    )

    if(Math.abs(this.boids[i].v[0]) > maxVelocity)
      this.boids[i].v[0] = this.boids[i].v[0] * 0.1
    if(Math.abs(this.boids[i].v[1]) > maxVelocity)
      this.boids[i].v[1] = this.boids[i].v[1] * 0.1

    // console.log(old, this.boids[i].pos)

  }
}

const Boid = function(canvas){
  this.canvas = canvas
  this.context = canvas.getContext('2d')
  this.anim = null
  this.stopped = false;
  this.init()
}

Boid.prototype.init = function(){

  if(typeof window === 'undefined') return;
  this.stopped = false;

  this.canvas.width = window.outerWidth;
  this.canvas.height = window.outerHeight;
  this.context.fillStyle = '#000000'
  this.context.translate(window.outerWidth/2, window.outerHeight/2);
  this.context.fillRect(
    -(window.outerWidth/2),
    -(window.outerHeight/2),
    window.outerWidth,
    window.outerHeight
  )

  this.center = [0,0]

  this.flocks = []
  for(let i=0;i<flockNum;i++){
    this.flocks.push(new Flock(this.center))
  }

  this.start();

}

Boid.prototype.start = function(){
  if(this.stopped) return;
  this.draw();
  this.calculate();

  this.anim = requestAnimationFrame(() => this.start())
}

Boid.prototype.calculate = function(){
  this.flocks.forEach(flock => flock.calculate())
}

Boid.prototype.draw = function(){

  // this.context.globalCompositeOperation = 'copy'
  this.context.fillStyle = '#000000'
  this.context.fillRect(
    (-window.outerWidth/2),
    (-window.outerHeight/2),
    window.outerWidth,
    window.outerHeight
  )

  // this.context.globalCompositeOperation = 'lighter'
  this.flocks.forEach(flock => flock.boids.forEach(boid => {

    this.context.fillStyle = boid.color;
    this.context.fillRect(
      boid.pos[0],
      boid.pos[1],
      boid.size,
      boid.size
    );
  }))
}


Boid.prototype.setCenter = function(e){
  const center = [
    e.pageX - (window.outerWidth/2),
    e.pageY - (window.outerHeight/2),
  ]
  this.flocks.forEach(flock => {
    flock.center = center
  })
}


Boid.prototype.stop = function(){
  this.stopped = true;
  this.anim && cancelAnimationFrame(this.anim)
}

export default Boid
