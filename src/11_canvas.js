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

/**
* @fileOverview HTML5 の Canvas 要素に関係するオブジェクトが定義されています.
*/ 

new Namespace(namespace_lib_canvas).use(function () {
	var ns = this;
	var nscore = new Namespace(namespace_lib_core);
	
	if (global.CanvasRenderingContext2D && 
	    !CanvasRenderingContext2D.prototype.createImageData && 
	    global.ImageData) {
	  	CanvasRenderingContext2D.prototype.createImageData = function(w,h) {
	    return new ImageData(w,h) 
	  };
	}
	var globalCtx = global.CanvasRenderingContext2D;
	
	/**
	* @class 色に関していろいろ操作できるオブジェクトです.
	* 
	**/
	proto(function Color() {
		/**
		* 引数に 16進数での色の値を与えて Color オブジェクトを作ります.
		* @param {Number}
		* @memberOf Color
		*/
		init(function(col16) {
			this.color = col16;
		})
		
		/** red の値. [read-write] */
		getter("r", function() {
			return this.color >> 16;
		})
		setter("r", function(val) {
			this.color = val << 16 | this.g << 8 | this.b;
		})
		
		/** green の値. [read-write] */
		getter("g", function() {
			return this.color >> 8 & 0xff;
		})
		setter("g", function(val) {
			this.color = this.r << 16 | this.b << 8 | this.b;
		})
		
		/** blue の値. [read-write] */
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
	* @class CapStyle
	* 
	**/
	singleton(function CapStyle() {
		// To initialize when the CapStyle.gen(params) called.
		init(function() {
		})
		/** @memberOf CapStyle */
		$$.NONE = "butt";
		/** @memberOf CapStyle */
		$$.ROUND = "round";
		/** @memberOf CapStyle */
		$$.SQUARE = "square";
	})
	
	/**
	* @class JointStyle
	* 
	**/
	singleton(function JointStyle() {
		// To initialize when the JointStyle.gen(params) called.
		init(function(args) {
		})
		/** @memberOf JointStyle */
		$$.BEVEL = "bevel";
		/** @memberOf JointStyle */
		$$.MITER = "miter";
		/** @memberOf JointStyle */
		$$.ROUND = "round";
	})
	
	/**
	* @class 線や塗、ビットマップのコピーなどの操作を受け付けます.通常は DisplayObject を介して使用します.
	* 
	**/
	proto(function Graphics() {
		/** @private */
		init(function(displayObject) {
			this.displayObject = displayObject;
			this.include(nscore.Recordable.gen());
			this.needStroke = false;
			this.needFill = false;
			
			// initialize context
			var op = nscore.Operation.gen(this, ctxInit);
			this.rec(op);
			
			this.boundWidth = 0;
			this.boundHeight = 0;
		});
		
		// beginBitmapFill {replace the description here}.
		def(function beginBitmapFill(bmd, matrix, repeat) {
			
		})
		
		/**
		* 塗を開始します.
		* @param color {Number} 
		* @parma alpha {Number}
		*/
		def(function beginFill(color, alpha) {
			if (alpha == undefined) alpha = 1;
			var col = ns.Color.gen(color);
			var style = "rgba(" + col.r + "," + col.g + "," + col.b + "," + alpha +")";
			
			this.rec(nscore.Operation.gen(this, ctxNeedFill, [true]))
			this.rec(nscore.Operation.gen(this, ctxSetFillStyle, [style]));
		})
		
		def(function beginGradientFill(type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod) {
			
		})
		
		def(function clear() {

		})
		
		/**
		* 曲線を描画します.
		* @param cpx {Number} コントロールポイントの x 値　
		* @param cpy {Number} コントロールポイントの y 値　
		* @param ax {Number} アンカーポイントの x 値
		* @param ay {Number} アンカーポイントの y 値
		*/
		def(function curveTo(cpx, cpy, ax, ay) {
			this.rec(nscore.Operation.gen(this, ctxCurveTo, [cpx, cpy, ax, ay]));
		})
		
		/**
		* 円を描画します.
		* @param x {Number} 円の中心の x 座標
		* @param y {Number} 円の中心の y 座標
		* @param r {Number} 円の半径
		*/
		def(function drawCircle(x, y, r) {
			this.rec(nscore.Operation.gen(this, ctxArc, [x, y, r]));
		})
		
		def(function drawEllipse(x, y, w, h) {
			
		})
		
		/**
		* 矩形を描画します.
		* @param x {Number} 描画する矩形の x 座標
		* @param y {Number} 描画する矩形の y 座標
		* @param w {Number} 描画する矩形の幅
		* @param h {Number} 描画する矩形の高さ
		*/
		def(function drawRect(x, y, w, h) {
			this.rec(nscore.Operation.gen(this, ctxFillRect, [x, y, w, h]));
		})
		
		def(function drawRoundRect(x, y, w, h, ellipseW, ellipseH) {
		
		})
		
		/** 塗を終了します. */
		def(function endFill() {
			this.rec(nscore.Operation.gen(this, ctxEndFill));
		})
		
		/**
		* 線のスタイルを指定します.
		* @param thickness {Number} 線の太さ
		* @param color {Number} 16進数の色の値
		* @param alpha {Number} 
		* @param caps {String} caps style
		* @param joints {String} joints style
		* @param mierLimit {Number}
		*/
		def(function lineStyle(thickness, color, alpha, caps, joints, miterLimit) {
			if (alpha == undefined) var alpha = 1;
			if (thickness == 0) alpha = 0;
			var col = ns.Color.gen(color);
			var style = "rgba(" + col.r + "," + col.g + "," + col.b + "," + alpha +")";
			var op = nscore.Operation.gen(this, ctxSetLineStyle, [thickness, style, caps, joints, miterLimit]);
			this.rec(op);
		})
		
		/** 
		* 線を引きます.
		* @param x {Number}
		* @param y {Number}
		*/
		def(function lineTo(x, y) {
			var op = nscore.Operation.gen(this, ctxLineTo, [x, y]);
			this.rec(op);
			updateBound.call(this, x, y);
		})
		
		/**
		* ペン先を移動します.
		* @param x {Number}
		* @param y {Number}
		*/
		def(function moveTo(x, y) {
			this.rec(nscore.Operation.gen(this, ctxMoveTo, [x, y]));
			updateBound.call(this, x, y);
		})
		
		/**
		* ベジェ曲線を引きます.
		* @param cp1x {Number}
		* @param cp1y {Number}
		* @param cp2x {Number}
		* @param cp2y {Number}
		* @param x {Number}
		* @param y {Number}
		*/
		def(function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
			this.rec(nscore.Operation.gen(this, ctxBezierCurveTo, [cp1x, cp1y, cp2x, cp2y, x, y]));
		})
		
		/**
		* ビットマップ画像を指定座標に転写します.
		* @param img {Image} DOM の Image element
		* @param x {Number} 
		* @param y {Number}
		*/
		def(function drawImage(img, x, y) {
			this.rec(nscore.Operation.gen(this, ctxDrawImage, [img, x, y]));
			updateBound.call(this, x + img.width, y + img.height);
		})
		
		/**
		* 指定座標にテキストを描画します
		* @param text {String}
		* @param x {Number}
		* @param y {Number}
		*/
		def(function drawText(text, x, y) {
			this.rec(nscore.Operation.gen(this, ctxDrawText, [text, x, y]));
			var c = this.context;
			var metrics = c.measureText(text);
			updateBound.call(this, x + metrics.widht, y);
		})
		
		
		/** @private */
		def(function getGlobalX() {
			return this.displayObject.globalX;
		})
		
		/** @private */
		def(function getGlobalY() {
			return this.displayObject.globalY;
		})
		
		/** @private */
		getter("context", function() {
			return this.displayObject.stage.context;
		})
		
		// privates
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
		
		function ctxSetFillStyle(style) {
			this.context.fillStyle = style;
		}
		
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
		
		function ctxCurveTo(cpx, cpy, ax, ay) {
			var gx = this.getGlobalX();
			var gy = this.getGlobalY();
			var c = this.context;
			c.quadraticCurveTo(cpx + gx, cpy + gy, ax + gx, ay + gy);
			if (this.needFill) this.context.fill();
			if (this.needStroke) c.stroke();
		}
		
		function ctxFillRect(x, y, w, h) {
			var gx = this.getGlobalX();
			var gy = this.getGlobalY();
			var c = this.context;
			c.beginPath();
			this.context.fillRect(x + gx, y + gy, w, h);
			c.closePath();
		}
		
		function ctxEndFill() {
			var c = this.context;
			if (this.needFill) c.fill();
			if (this.needStroke) c.stroke();
			c.closePath();
		}
		
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
		
		function ctxLineTo(x, y) {
			var c = this.context;
			c.lineTo(this.getGlobalX() + x, this.getGlobalY() + y);
			if (this.needFill) c.fill();
			if (this.needStroke) c.stroke();
		}
		
		function ctxMoveTo(x, y) {
			this.context.moveTo(this.getGlobalX() + x, this.getGlobalY() + y);
		}
		
		function ctxBezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
			var gx = this.getGlobalX();
			var gy = this.getGlobalY();
			
			var c = this.context;
			c.bezierCurveTo(cp1x + gx, cp1y + gx, cp2x + gx, cp2y + gy, x + gx, y + gy);
			if (this.needFill) c.fill();
			if (this.needStroke) c.stroke();
		}
		
		function ctxDrawImage(img, x, y) {
			var gx = this.getGlobalX();
			var gy = this.getGlobalY();
			this.context.drawImage(img, x + gx, y + gy);
		}
		
		function ctxDrawText(text, x, y) {
				var gx = this.getGlobalX();
				var gy = this.getGlobalY();
				this.context.fillText(text, x + gx, y + gy);
				this.context.strokeText(text, x + gx, y + gy);
		}
		
		function updateBound(x, y) {
			if (this.boundWidth < x) this.boundWidth = x;
			if (this.boundHeight < y) this.boundHeight = y;
		}
	})
	
	/**
	* @class ActionScript の DisplayObject 風インターフェース.
	* 
	**/
	proto(function DisplayObject() {
		/** @memberOf DisplayObject */
		init(function() {
			//this.graphics = ns.Graphics.gen(ns.Stage.getInstance().context);
			this._mx = 0, this._my = 0;
			this._g = ns.Graphics.gen(this);
			this._stg = null;
			this._sx = this._sy = 1;

			this.visible = true;
			this.alpha = 1;
		})
		
		/**
		* 描画します.
		*/
		def(function draw() {
			var c = this._g.context;
			var sX = this.scaleX;
			var sY = this.scaleY;
			var offsetX = this.globalX;
			var offsetY = this.globalY;
			if (sX != 1 || sY != 1) {
				c.setTransform(sX, 0, 0, sY, -offsetX * sX, -offsetY * sY);
				c.translate(offsetX / sX, offsetY / sY);
			}
			if (this.visible) this._g.playback();
			if (sX != 1 || sY != 1) {
				
				c.setTransform(1, 0, 0, 1, 0, 0);
			}
		})
		
		/** x 座標. [read-write] */
		getter("x", function() {return this._mx})
		setter("x", function(val) {this._mx = val;})
		/** y 座標. [read-write] */
		getter("y", function() {return this._my})
		setter("y", function(val) {this._my = val})
		
		/** 幅. [read-only] */
		getter("width", function() {return this._g.boundWidth})
		/** 高さ. [read-only] */
		getter("height", function() {return this._g.boundHeight})
		
		/** x scale. [read-write] */
		getter("scaleX", function() {
			return this._sx * (this.parent ? this.parent.scaleX : 1);
		})
		setter("scaleX", function(val) {this._sx = val})
		/** y scale. [read-write] */
		getter("scaleY", function() {
			return this._sy * (this.parent ? this.parent.scaleY : 1);
		})
		setter("scaleY", function(val) {this._sx = val})
		
		
		getter("globalX", function() {
			if (this.parent == undefined) return 0;
			return this._mx + this.parent.globalX;
		})
		getter("globalY", function() {
			if (this.parent == undefined) return 0;
			return this._my + this.parent.globalY;
		})
		/** このオブジェクトの属するステージへの参照. [read-only] */
		getter("stage", function () {
			return this._stg;
		})
		/** このオブジェクトの持つ graphics オブジェクトへの参照. [read-only] */
		getter("graphics", function() {return this._g})
	})
	
	/**
	* @class ActionScript の DisplayObjectContainer 風インターフェース.
	* @augments DisplayObject
	**/
	proto(function DisplayObjectContainer() {
		ex(ns.DisplayObject)
		
		/** @memberOf DisplayObjectContainer */
		init(function() {
			this.$super();
			this.children = [];
			this._stg = null;
		})
		
		/**
		* このDisplayObjectContainerオブジェクトの表示ツリーに表示オブジェクトを追加します.
		* @param child {DisplayObject}
		*/
		def(function addChild(child) {
			this.numChildren.times(function (i) {
				if (this.children[i] == child) this.children.splice(i, 1);
			}, this);
			this.children.push(child);
			child.parent = this;
			child._stg = this._stg;
		})
		
		/**
		* このDisplayObjectContainerオブジェクトの表示ツリーに、重ね順を指定して表示オブジェクトを追加します.
		* @param child {DisplayObject}
		* @param index {Number}
		*/
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
		
		/**
		* このDisplayObjectContainerオブジェクトの表示ツリーから表示オブジェクトを削除します.
		* @param child {DisplayObject}
		*/
		def(function removeChild(child) {
			var i = 0;
			this.children.each(function (c) {
				if (c == child) {
					this.children.splice(i, 1);
					return 0;
				}
				i++;
			}, this);
		})
		
		// draw {replace the description here}.
		def(function draw() {
			this.$super();
			this.numChildren.times(function (i) {
				this.children[i].draw();
			}, this)
		})
		
		/** 
		* このDisplayObjectContainerの子である表示オブジェクトの数.　[read-only]
		*/
		getter("numChildren", function() {return this.children.length;})
	})
	
	/**
	* @class ActionScript の Stage 風インターフェース.
	* @augments DisplayObjectContainer
	**/
	proto(function Stage() {
		ex(ns.DisplayObjectContainer);
		
		/** 
		* HTMLのCanvasを渡して Stage オブジェクトを作ります.
		* @param canvas {DOM Canvas Element}
		* @memberOf Stage
		*/
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
		
		
		def(function addChild(child) {
			this.$super(child);
		})
		
		// draw {replace the description here}.
		def(function draw() {
			this.numChildren.times(function (i) {
				this.children[i].draw();
			}, this)
		})
		
		/** Stage の幅です. [read-only] */
		getter("stageWidth", function() {return this.w});
		/** Stage の高さです. [read-only] */
		getter("stageHeight", function() {return this.h});
	})
	
	
})