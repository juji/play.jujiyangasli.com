

const Thing = function(canvas){
  this.canvas = canvas
  this.context = canvas.getContext('2d')
  this.anim = null
  this.init()
}

Thing.prototype.init = function(){

  if(typeof window === 'undefined') return;

}

Thing.prototype.stop = function(){
  this.anim && cancelAnimationFrame(this.anim)
}

export default Thing
