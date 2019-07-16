

const Thing = function(canvas){
  this.canvas = canvas
  this.context = canvas.getContext('2d')
  this.anim = null
  this.init()
}

Thing.prototype.init = function(){

  if(typeof window === 'undefined') return;
  this.canvas.width = window.outerWidth
  this.canvas.height = window.outerHeight

  //background
  context.fillStyle = '#000000';
  context.fillRect(0,0, window.outerWidth, window.outerHeight);

  // line
  this.context.strokeStyle = '#ffffff'

  window.translate(0.5, 0.5)

}

Thing.prototype.stop = function(){
  this.anim && cancelAnimationFrame(this.anim);
}

export default Thing
