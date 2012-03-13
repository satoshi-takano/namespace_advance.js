/* =====================================================
Copyright (c) 2012 Satoshi Takano (ikke.co)

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
===================================================== */

new Namespace(namespace_lib_canvas).use(function () {
	var ns = this;
	var nscore = new Namespace(namespace_lib_core);
	
	if (window.CanvasRenderingContext2D && 
	    !CanvasRenderingContext2D.prototype.createImageData && 
	    window.ImageData) {
	  	CanvasRenderingContext2D.prototype.createImageData = function(w,h) {
	    return new ImageData(w,h) 
	  };
	}
	var globalCtx = window.CanvasRenderingContext2D;
	
	/**
	* @archetype Color
	* 
	**/
	proto(function Color() {
		// To initialize when the Color.gen(params) called.
		init(function(col16) {
			this.color = col16;
		})
		
		getter("r", function() {
			return this.color >> 16;
		})
		setter("r", function(val) {
			this.color = val << 16 | this.g << 8 | this.b;
		})
		
		getter("g", function() {
			return this.color >> 8 & 0xff;
		})
		setter("g", function(val) {
			this.color = this.r << 16 | this.b << 8 | this.b;
		})
		
		getter("b", function() {
			return this.color & 0xff;
		})
		setter("b", function(val) {
			this.color = this.r << 16 | this.g << 8 | val;
		})
	})
	
	/**
	* @archetype BitmapData
	* 
	**/
	proto(function BitmapData() {
		// To initialize when the BitmapData.gen(params) called.
		init(function(w, h) {
			this.w = w;
			this.h = h;
			
			var canvas = document.createElement("canvas");
			if (canvas == null) {
				console.error("Your browser hasn't support HTML5 Canvas.")
				return;
			}
			var ctx = canvas.getContext("2d");
			if (ctx == null) {
				console.error("Your browser hasn't support HTML5 Canvas.")
				return;
			}
			this.imgData = ctx.createImageData(w, h);
		})
		
		// draw {replace the description here}.
		def(function draw(drawable) {
			
		})
		
		getter("width", function() {
			return this.w;
		})
		getter("height", function() {
			return this.h;
		})
	})
	
	
	/**
	* @archetype CapStyle
	* 
	**/
	singleton(function CapStyle() {
		// To initialize when the CapStyle.gen(params) called.
		init(function() {
			
		})
		
		$$.NONE = "butt";
		$$.ROUND = "round";
		$$.SQUARE = "square";
	})
	
	/**
	* @archetype JointStyle
	* 
	**/
	singleton(function JointStyle() {
		// To initialize when the JointStyle.gen(params) called.
		init(function(args) {
			
		})
		
		$$.BEVEL = "bevel";
		$$.MITER = "miter";
		$$.ROUND = "round";
	})
	
	/**
	* @archetype Graphics
	* 
	**/
	proto(function Graphics() {
//		include(nscore.OperationRecorder)
		
		// To initialize when the Graphics.gen(params) called.
		init(function(displayObject) {
			this.displayObject = displayObject;
			this.needFill = false;
			
			this.include(nscore.OperationRecorder.gen());
		})
		
		// beginBitmapFill {replace the description here}.
		def(function beginBitmapFill(bmd, matrix, repeat) {
			
		})
		
		// beginFill {replace the description here}.
		def(function beginFill(color, alpha) {
			if (alpha == undefined) alpha = 1;
			var col = ns.Color.gen(color);
			this.context.fillStyle = "rgba(" + col.r + "," + col.g + "," + col.b + "," + alpha +")";
			this.needFill = true;
			
			this.rec();
		})
		
		// beginGradientFill {replace the description here}.
		def(function beginGradientFill(type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod) {
			
		})
		
		// clear {replace the description here}.
		def(function clear() {
			this.context.clearRect(0, 0, 900, 300);
			this.needFill = false;
		})
		
		// curveTo {replace the description here}.
		def(function curveTo(cpx, cpy, ax, ay) {
			var gx = this.getGlobalX();
			var gy = this.getGlobalY();
			
			var c = this.context;
			c.quadraticCurveTo(cpx + gx, cpy + gy, ax + gx, ay + gy);
			if (this.needFill) this.context.fill();
			c.stroke();
			
			this.rec();
		})
		
		// drawCircle {replace the description here}.
		def(function drawCircle(x, y, r) {
			var gx = this.getGlobalX();
			var gy = this.getGlobalY();
			
			var c = this.context;
			c.beginPath();
			c.arc(x + gx, y + gy, r, 0, 2 * Math.PI, false);
			c.closePath();
			c.fill();
			c.stroke();
			
			this.rec();
		})
		
		// drawEllipse {replace the description here}.
		def(function drawEllipse(x, y, w, h) {
			
		})
		
		// drawRect {replace the description here}.
		def(function drawRect(x, y, w, h) {
			var gx = this.getGlobalX();
			var gy = this.getGlobalY();
			
			var c = this.context;
			c.fillRect(x + gx, y + gy, w, h);
			c.stroke();
			
			this.rec();
		})
		
		// drawRoundRect {replace the description here}.
		def(function drawRoundRect(x, y, w, h, ellipseW, ellipseH) {
		
		})
		
		// endFill {replace the description here}.
		def(function endFill() {
			if (this.needFill) this.context.fill();
			this.needFill = false;
			
			this.rec();
		})
		
		// lineStyle {replace the description here}.
		def(function lineStyle(thickness, color, alpha, caps, joints, miterLimit) {
			var c = this.context;
			c.lineWidth = thickness;
			
			if (alpha == undefined) var alpha = 1;
			var col = ns.Color.gen(color);
			c.strokeStyle = "rgba(" + col.r + "," + col.g + "," + col.b + "," + alpha +")";
			c.lineCap = caps;
			c.lineJoin = joints;
			c.miterLimit = miterLimit;
			
			this.rec();
		})
		
		// lineTo {replace the description here}.
		def(function lineTo(x, y) {
			var gx = this.getGlobalX();
			var gy = this.getGlobalY();
			
			var c = this.context;
			c.lineTo(x + gx, y + gy);
			if (this.needFill) this.context.fill();
			c.stroke();
			
			this.rec();
		})
		
		// moveTo {replace the description here}.
		def(function moveTo(x, y) {
			var gx = this.getGlobalX();
			var gy = this.getGlobalY();
			
			this.context.moveTo(x + gx, y + gy);
			
			this.rec();
		})
		
		// beginPath {replace the description here}.
		def(function beginPath() {
			this.context.beginPath();
			
			this.rec();
		})
		
		// closePath {replace the description here}.
		def(function closePath() {
			this.context.closePath();
			
			this.rec();
		})
		
		// bezierCurveTo {replace the description here}.
		def(function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
			var gx = this.getGlobalX();
			var gy = this.getGlobalY();
			
			var c = this.context;
			c.bezierCurveTo(cp1x + gx, cp1y + gx, cp2x + gx, cp2y + gy, x + gx, y + gy);
			c.stroke();
			
			this.rec();
		})
		
		getter("context", function() {return this.displayObject.context;})
		// getGlobalX {replace the description here}.
		def(function getGlobalX() {
			return this.displayObject.globalX;
		})
		// getGlobalY {replace the description here}.
		def(function getGlobalY() {
			return this.displayObject.globalY;
		})
	})
	
	/**
	* @archetype DisplayObject
	* 
	**/
	proto(function DisplayObject() {
		// To initialize when the DisplayObject.gen(params) called.
		init(function() {
			//this.graphics = ns.Graphics.gen(ns.Stage.getInstance().context);
			this.ctx = null, this.mx = 0, this.my = 0, this.w = 0, this.h = 0;
			this.g = ns.Graphics.gen(this);
		})
		
		getter("x", function() {return this.mx})
		setter("x", function(val) {this.mx = val})
		getter("y", function() {return this.my})
		setter("y", function(val) {this.my = val})
		getter("width", function() {return this.w})
		setter("width", function(val) {this.w = val})
		getter("height", function() {return this.h})
		setter("height", function(val) {this.h = val})
		
		setter("scaleX", function(val) {
			var c = this.graphics.context;
			c.clearRect(0, 0, 400, 400);
			c.scale(val, 1);
//			trace(this.parent);
			this.parent.graphics.playback();
//			this.graphics.playback();
		})
		
		getter("globalX", function() {
			if (this.parent == undefined) return 0;
			return this.mx + this.parent.globalX;
		})
		getter("globalY", function() {
			if (this.parent == undefined) return 0;
			return this.my + this.parent.globalY;
		})
		
		getter("context", function() {return this.ctx})
		setter("context", function(ctx) {this.ctx = ctx;})
		getter("graphics", function() {return this.g})
	})
	
	/**
	* @archetype DisplayObjectContainer
	* 
	**/
	proto(function DisplayObjectContainer() {
		ex(ns.DisplayObject)
		
		// To initialize when the DisplayObjectContainer.gen(params) called.
		init(function() {
			this.$super();
			this.children = [];
		})
		
		// addChild {replace the description here}.
		def(function addChild(child) {
			this.children.push(child);
			child.parent = this;
			child.context = this.context;
		})
		
	})
	
	/**
	* @archetype Stage
	* 
	**/
	proto(function Stage() {
		ex(ns.DisplayObjectContainer);
		
		// To initialize when the Stage.gen(params) called.
		init(function(canvas) {
			var context = canvas.getContext("2d");
			if (context == null) {
				console.error("Your browser hasn't support HTML5 Canvas.")
				return;
			}
			
			this.context = context;
			this.w = canvas.width;
			this.h = canvas.height;
		})
		
		// addChild {replace the description here}.
		def(function addChild(child) {
			this.$super(child);
		})
		
		
		getter("width", function() {return this.w});
		getter("height", function() {return this.h});
	})
	
	
})