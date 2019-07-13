var Utils = {};
Utils.hsvToRgb = function(h, s, v) {
	var r, g, b;
	var i;
	var f, p, q, t;

	// Make sure our arguments stay in-range
	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(100, s));
	v = Math.max(0, Math.min(100, v));

	s /= 100; v /= 100;

	if(s === 0) {
		r = g = b = v;
		return {r:Math.round(r * 255), g:Math.round(g * 255), b:Math.round(b * 255)};
	}

	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	f = h - i; // factorial part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));

	switch(i) {
		case 0:r = v;g = t;b = p;break;
		case 1:r = q;g = v;b = p;break;
		case 2:r = p;g = v;b = t;break;
		case 3:r = p;g = q;b = v;break;
		case 4:r = t;g = p;b = v;break;
		default:r = v;g = p;b = q;
	}

	return {r:Math.round(r * 255), g:Math.round(g * 255), b:Math.round(b * 255)};
}

Utils.blend = function(color1,color2,factor){
	if(typeof color1=='number'){
		return color1 + (factor*(color2-color1));
	}
	var f = {};
	for(var i in color1){
		f[i] = color1[i] + (factor*(color2[i]-color1[i]));
	}
	return f;
}

Utils.map = function(val,minv,maxv,minr,maxr,ease){
	return minr + ((val-minv)/(maxv-minv))*(maxr-minr);
}

const noise = 0.005;
const maxItt = 50000;
const sample = 500;
const colorSpan = .4;
const blackBackground=10;
const background = blackBackground|blackBackground<<8|blackBackground<<16|255<<24;
const windowRatio = 0.20;
const colorRange = [128,360]; //H
const saturationRange = [100,0]; //S
const brightnessRange = [0,100]; //V

const Dejong = function(canvas){

  this.canvas = canvas;
  this.anim = null
  this.stopped = false
  this.init()

}

Dejong.prototype.init = function(){

  if(typeof window === 'undefined') return;
  this.stopped = false;

  this.colorPixel = [];
	this.densityPixel = [];
  this.currentSample = 0;
  this.maxDensity=0;

  this.xn = 0;// + (Math.sin(Math.random()*Math.PI*2)*.1);
	this.yn = 0;// + (Math.sin(Math.random()*Math.PI*2)*.1);
	this.zn = 0;// + (Math.sin(Math.random()*Math.PI*2)*.1);
	this.a = 0 + (Math.sin(Math.random()*Math.PI*2)*4.5);
	this.b = 0 + (Math.sin(Math.random()*Math.PI*2)*4.5);
	this.c = 0 + (Math.sin(Math.random()*Math.PI*2)*4.5);
	this.d = 0 + (Math.sin(Math.random()*Math.PI*2)*4.5);
  this.itt = maxItt / 10;

  this.wratio = Math.min(window.outerWidth,window.outerHeight) * windowRatio;
	this.hratio = Math.min(window.outerWidth,window.outerHeight) * windowRatio;
	this.centerX = window.outerWidth/2;
	this.centerY = window.outerHeight/2;

	this.canvas.width  = window.outerWidth;
	this.canvas.height = window.outerHeight;

	this.context = this.canvas.getContext("2d");
	this.context.fillStyle = '#' + (blackBackground|(blackBackground<<8)|(blackBackground<<16)).toString(16);
	this.context.fillRect(0,0,this.canvas.width,this.canvas.height);

	//
	//context.putImageData(bitmap, 0, 0);

	var  n = this.canvas.height*this.canvas.width;
	for(var i=0;i<n;i++){
    this.colorPixel.push(0);
    this.densityPixel.push(0);
  }

  if(!this.anim) this.itterate();

}

Dejong.prototype.itterate = function(){

  if(this.stopped) return;

  if(this.currentSample > sample){
    this.anim = null;
    this.plot()
    return;
  }

	var initx = this.xn;
	for(var i=0;i<this.itt;i++){

    if(this.stopped) return;

    initx = this.xn;

		//dejong
		this.xn = Math.sin(this.a*this.yn) - Math.cos(this.b*this.xn);
		this.yn = Math.sin(this.c*initx) - Math.cos(this.d*this.yn);

		//add some noise
		this.xn += noise*Math.sin(Math.random()*Math.PI*2);
		this.yn += noise*Math.sin(Math.random()*Math.PI*2);

		var x = Math.round( this.centerX+(this.xn*this.wratio) );
		var y = Math.round( this.centerY+(this.yn*this.hratio) );
    if(y<0) continue;
    if(y>this.canvas.height) continue;
    if(x<0) continue;
    if(x>this.canvas.width) continue;
		var idx = ( this.canvas.width * y) + x;

		if(idx<0) break;
		if(idx>=this.colorPixel.length) break;
		this.colorPixel[idx] = Math.round( this.centerX+(initx*this.canvas.width*colorSpan) );
		this.densityPixel[idx] += 1;

    if(this.densityPixel[idx] > this.maxDensity){
      this.maxDensity = this.densityPixel[idx];
    }

    // to draw or not to draw
    if(Math.random()>.8){

      let logDensity = Math.log(this.maxDensity);
      let logPixel = Math.log(this.densityPixel[idx]);
      let rgb = Utils.hsvToRgb(
  			Utils.map(this.colorPixel[idx],0,this.canvas.width,colorRange[0],colorRange[1]),
  			Utils.map(logPixel,0,logDensity,saturationRange[0],saturationRange[1]),
  			Utils.map(logPixel,0,logDensity,brightnessRange[0],brightnessRange[1])
  		);

      // r and b are switched, works okay...
      this.context.fillStyle = '#' + Math.max(background,(
        (rgb.b<<16) |
        (rgb.g<<8) |
        (rgb.r)
      )).toString(16);
      this.context.fillRect(x,y,1,1)

    }

	}

  if(this.itt < maxItt){
    this.itt += this.itt
  }


  this.currentSample++;
  (!(this.currentSample%50)) && this.plot();

  if(this.anim){ cancelAnimationFrame(this.anim) }
  this.anim = requestAnimationFrame(() => this.itterate());



}

Dejong.prototype.stop = function(){
  this.stopped = true
}

Dejong.prototype.plot = function(){

  var bitmap = this.context.createImageData(this.canvas.width, this.canvas.height);
	var buf = new ArrayBuffer(bitmap.data.length);
	var buf8 = new Uint8ClampedArray(buf);
	var data = new Uint32Array(buf);
	var index=0;
	var x,y;
	var logDensity = Math.log(this.maxDensity);

	for(var i=0;i<this.colorPixel.length;i++){


		if(this.densityPixel[i]<=0) {
     data[i] = background;
			continue;
		}


		var logPixel = Math.log(this.densityPixel[i]);
		var rgb = Utils.hsvToRgb(
			Utils.map(this.colorPixel[i],0,this.canvas.width,colorRange[0],colorRange[1]),
			Utils.map(logPixel,0,logDensity,saturationRange[0],saturationRange[1]),
			Utils.map(logPixel,0,logDensity,brightnessRange[0],brightnessRange[1])
		);
		data[i] = Math.max(background,(
      (255 << 24) |
      (rgb.r << 16) |
      (rgb.g << 8 ) |
      (rgb.b)
    ));
	}

	bitmap.data.set(buf8);
	this.context.putImageData(bitmap,0,0);
  // console.log('plot')

  // let x = 0, y = 0;
  //
  // for(let i=0;i<this.colorPixel.length;i++){
  //
  //   if(this.densityPixel[i]===0) {
  //     continue;
  //   }
  //
  //   y = Math.floor(i / this.canvas.width)
  //   x = i - (this.canvas.width * y);
  //
  //   let logDensity = Math.log(this.maxDensity);
  //   let logPixel = Math.log(this.densityPixel[i]);
  //   let rgb = Utils.hsvToRgb(
	// 		Utils.map(this.colorPixel[i],0,this.canvas.width,colorRange[0],colorRange[1]),
	// 		Utils.map(logPixel,0,logDensity,saturationRange[0],saturationRange[1]),
	// 		Utils.map(logPixel,0,logDensity,brightnessRange[0],brightnessRange[1])
	// 	);
  //
  //   this.context.fillStyle = '#' + Math.max(background,((rgb.b<<16) | (rgb.g << 8 ) | ( rgb.r ))).toString('16');
  //   this.context.fillRect(x,y,1,1)
  //
  // }

}

export default Dejong;
