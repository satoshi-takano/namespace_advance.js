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
		// To initialize when the Graphics.gen(params) called.
		init(function(displayObject) {
			this.displayObject = displayObject;
			this.include(nscore.Recordable.gen());
			this.needStroke = false;
			this.needFill = false;
			
			// initialize context
			var op = nscore.Operation.gen(this, ctxInit);
			this.rec(op);
		});
		function ctxInit() {
			var c = this.context;
			c.fillStyle = "#000000"
			c.strokeStyle = "#000000";
			c.lineWidth = 1;
			c.lineCap = ns.CapStyle.NONE;
 			c.lineJoin = ns.JointStyle.MITER;
 			c.miterLimit = 10.0;
			c.closePath();
			c.moveTo(0, 0);
		}
		function ctxNeedFill(bool) {this.needFill = bool;}
		function ctxNeedStroke(bool) {this.needStroke = bool;}
		
		// beginBitmapFill {replace the description here}.
		def(function beginBitmapFill(bmd, matrix, repeat) {
			
		})
		
		// beginFill {replace the description here}.
		def(function beginFill(color, alpha) {
			if (alpha == undefined) alpha = 1;
			var col = ns.Color.gen(color);
			var style = "rgba(" + col.r + "," + col.g + "," + col.b + "," + alpha +")";
			
			this.rec(nscore.Operation.gen(this, ctxNeedFill, [true]))
			this.rec(nscore.Operation.gen(this, ctxSetFillStyle, [style]));
		})
		function ctxSetFillStyle(style) {
			this.context.fillStyle = style;
		}
		
		// beginGradientFill {replace the description here}.
		def(function beginGradientFill(type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod) {
			
		})
		
		// clear {replace the description here}.
		def(function clear() {

		})
		
		// curveTo {replace the description here}.
		def(function curveTo(cpx, cpy, ax, ay) {
			this.rec(nscore.Operation.gen(this, ctxCurveTo, [cpx, cpy, ax, ay]));
		})
		function ctxCurveTo(cpx, cpy, ax, ay) {
			var gx = this.getGlobalX();
			var gy = this.getGlobalY();
			var c = this.context;
			c.quadraticCurveTo(cpx + gx, cpy + gy, ax + gx, ay + gy);
			if (this.needFill) this.context.fill();
			if (this.needStroke) c.stroke();
		}
		
		// drawCircle {replace the description here}.
		def(function drawCircle(x, y, r) {
			this.rec(nscore.Operation.gen(this, ctxArc, [x, y, r]));
		})
		function ctxArc(x, y, r) {
			var c = this.context;
			var gx = this.getGlobalX();
			var gy = this.getGlobalY();
			c.beginPath();
			c.arc(x + gx, y + gy, r, 0, Math.PI * 2, false);
			if (this.needFill) c.fill();
			if (this.needStroke) c.stroke();
			c.closePath();
		}
		
		// drawEllipse {replace the description here}.
		def(function drawEllipse(x, y, w, h) {
			
		})
		
		// drawRect {replace the description here}.
		def(function drawRect(x, y, w, h) {
			this.rec(nscore.Operation.gen(this, ctxFillRect, [x, y, w, h]));
		})
		function ctxFillRect(x, y, w, h) {
			var gx = this.getGlobalX();
			var gy = this.getGlobalY();
			var c = this.context;
			c.beginPath();
			this.context.fillRect(x + gx, y + gy, w, h);
			c.closePath();
		}
		
		// drawRoundRect {replace the description here}.
		def(function drawRoundRect(x, y, w, h, ellipseW, ellipseH) {
		
		})
		
		// endFill {replace the description here}.
		def(function endFill() {
			this.rec(nscore.Operation.gen(this, ctxEndFill));
		})
		function ctxEndFill() {
			var c = this.context;
			if (this.needFill) c.fill();
			if (this.needStroke) c.stroke();
			c.closePath();
		}
		
		// lineStyle {replace the description here}.
		def(function lineStyle(thickness, color, alpha, caps, joints, miterLimit) {
			if (alpha == undefined) var alpha = 1;
			var col = ns.Color.gen(color);
			var style = "rgba(" + col.r + "," + col.g + "," + col.b + "," + alpha +")";
			var op = nscore.Operation.gen(this, ctxSetLineStyle, [thickness, style, caps, joints, miterLimit]);
			this.rec(op);
		})
		function ctxSetLineStyle(thickness, style, caps, joints, miterLimit) {
			var c = this.context;
			c.strokeStyle = style;
			c.lineWidth = thickness;
			c.lineCap = caps;
 			c.lineJoin = joints;
 			c.miterLimit = miterLimit;
			this.needStroke = true;
			c.beginPath();
		}
		
		// lineTo {replace the description here}.
		def(function lineTo(x, y) {
			var op = nscore.Operation.gen(this, ctxLineTo, [x, y]);
			this.rec(op);
		})
		function ctxLineTo(x, y) {
			var c = this.context;
			c.lineTo(this.getGlobalX() + x, this.getGlobalY() + y);
			if (this.needFill) c.fill();
			if (this.needStroke) c.stroke();
		}
		
		// moveTo {replace the description here}.
		def(function moveTo(x, y) {
			this.rec(nscore.Operation.gen(this, ctxMoveTo, [x, y]));
		})
		function ctxMoveTo(x, y) {
			this.context.moveTo(this.getGlobalX() + x, this.getGlobalY() + y);
		}
		
		// bezierCurveTo {replace the description here}.
		def(function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
			this.rec(nscore.Operation.gen(this, ctxBezierCurveTo, [cp1x, cp1y, cp2x, cp2y, x, y]));
		})
		function ctxBezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
			var gx = this.getGlobalX();
			var gy = this.getGlobalY();
			
			var c = this.context;
			c.bezierCurveTo(cp1x + gx, cp1y + gx, cp2x + gx, cp2y + gy, x + gx, y + gy);
			if (this.needFill) c.fill();
			if (this.needStroke) c.stroke();
		}
		
		// drawImage {replace the description here}.
		def(function drawImage(img, x, y) {
			this.rec(nscore.Operation.gen(this, ctxDrawImage, [img, x, y]));
		})
		function ctxDrawImage(img, x, y) {
			var gx = this.getGlobalX();
			var gy = this.getGlobalY();
			this.context.drawImage(img, x + gx, y + gy);
		}
		
		// getGlobalX {replace the description here}.
		def(function getGlobalX() {
			return this.displayObject.globalX;
		})
		
		// getGlobalY {replace the description here}.
		def(function getGlobalY() {
			return this.displayObject.globalY;
		})
		
		getter("context", function() {
			return this.displayObject.stage.context;
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
			this._mx = 0, this._my = 0, this._w = 0, this._h = 0;
			this._g = ns.Graphics.gen(this);
			this._stg = null;
		})
		
		// draw {replace the description here}.
		def(function draw() {
			this._g.playback();
		})
		
		
		getter("x", function() {return this._mx})
		setter("x", function(val) {
			this._mx = val;
			
		})
		getter("y", function() {return this._my})
		setter("y", function(val) {this._my = val})
		getter("width", function() {return this._w})
		setter("width", function(val) {this._w = val})
		getter("height", function() {return this._h})
		setter("height", function(val) {this._h = val})
		
		getter("globalX", function() {
			if (this.parent == undefined) return 0;
			return this._mx + this.parent.globalX;
		})
		getter("globalY", function() {
			if (this.parent == undefined) return 0;
			return this._my + this.parent.globalY;
		})
		getter("stage", function () {
			return this._stg;
		})
		getter("graphics", function() {return this._g})
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
			this.numChildren.times(function (i) {
				if (this.children[i] == child) this.children.splice(i, 1);
			}, this);
			this.children.push(child);
			child.parent = this;
			child._stg = this._stg;
		})
		
		// addChildAt {replace the description here}.
		def(function addChildAt(child, index) {
			var numChildren = this.numChildren;
			numChildren.times(function (i) {
				if (this.children[i] == child) this.children.splice(i, 1);
			}, this);
			var left = this.children.splice(0, index);
			var right = this.children.splice(0, this.numChildren);
			left.push(child);
			this.children = left.concat(right);
			child.parent = this;
			child._stg = this._stg;
		})
		
		
		// draw {replace the description here}.
		def(function draw() {
			this.graphics.playback();
			this.numChildren.times(function (i) {
				this.children[i].draw();
			}, this)
		})
		
		getter("numChildren", function() {return this.children.length;})
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
			this._stg = this;
		})
		
		// addChild {replace the description here}.
		def(function addChild(child) {
			this.$super(child);
		})
		
		// draw {replace the description here}.
		def(function draw() {
			this.numChildren.times(function (i) {
				this.children[i].draw();
			}, this)
		})
		
		
		getter("stageWidth", function() {return this.w});
		getter("stageHeight", function() {return this.h});
	})
	
	
})