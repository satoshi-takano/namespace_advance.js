/* =====================================================
Copyright (c) 2012 Satoshi Takano

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
	var nsevent = new Namespace(namespace_lib_events);
	var nsgeom = new Namespace(namespace_lib_geom);
	
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
		ex(nscore.Recordable)
		
		/** @private */
		init(function() {
			this.$super();
			
			this.context = null;
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
			updateBound.call(this, x + w, y + h);
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
		def(function drawImage(img) {
			this.rec(nscore.Operation.gen(this, ctxDrawImage, [img]));
			updateBound.call(this, img.width, img.height);
		})
		
		def(function setFormat(formatString) {
			this.rec(nscore.Operation.gen(this, ctxSetFormat, [formatString]));
			this.currentFormat = formatString;
		})
		
		def(function getTextMetrics(text) {
			var c = this.context;
			c.font = this.currentFormat;
			return c.measureText(text);
		})
		
		
		/**
		* 指定座標にテキストを描画します
		* @param text {String}
		* @param x {Number}
		* @param y {Number}
		*/
		def(function drawText(text) {
			this.rec(nscore.Operation.gen(this, ctxDrawText, [text]));
		})
		
		def(function clear() {
			this.$super();
			this.boundWidth = 0;
			this.boundHeight = 0;
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
			c.beginPath();
			c.arc(x, y, r, 0, Math.PI * 2, false);
			if (this.needFill) c.fill();
			if (this.needStroke) c.stroke();
			c.closePath();
		}
		
		function ctxCurveTo(cpx, cpy, ax, ay) {
			var c = this.context;
			c.quadraticCurveTo(cpx, cpy, ax + gx, ay + gy);
			if (this.needFill) this.context.fill();
			if (this.needStroke) c.stroke();
		}
		
		function ctxFillRect(x, y, w, h) {
			var c = this.context;
			c.beginPath();
			this.context.fillRect(0, 0, w, h);
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
			c.lineTo(x, y);
			if (this.needFill) c.fill();
			if (this.needStroke) c.stroke();
		}
		
		function ctxMoveTo(x, y) {
			this.context.moveTo(x, y);
		}
		
		function ctxBezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
			var c = this.context;
			c.bezierCurveTo(cp1x, cp1y, cp2x + gx, cp2y + gy, x + gx, y + gy);
			if (this.needFill) c.fill();
			if (this.needStroke) c.stroke();
		}
		
		function ctxDrawImage(img) {
			this.context.drawImage(img, 0, 0);
		}
		
		function ctxSetFormat(formatString) {
			this.context.font = formatString;
		}
		
		function ctxDrawText(text) {
			var c = this.context;
			c.fillText(text, 0, 0);
			c.strokeText(text, 0, 0);
			var metrics = c.measureText(text);
			updateBound.call(this, metrics.width, 0);
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
		ex(nsevent.EventDispatcher);
		var ii = 0
		/** @memberOf DisplayObject */
		init(function() {
			this.$super();
			
			this._mx = 0, this._my = 0;
			this._g = ns.Graphics.gen();
			this.ii = ++ii
			this._stg = null;
			this._sx = this._sy = 1;

			this.visible = true;
			this.alpha = 1;
			this._rotation = 0;
			
			this.mouseChildren = true;
			this._mouseOvered = false;
			// imaichi...
			this._mouseOutFlag = false;
		})
		
		def(function addedToStage() {
			this._g.context = this._stg.context;
		})
		
		def(function removeFromStage() {
			child._g.context = null;
		})
		
		/**
		* 描画します.
		*/
		def(function draw() {
			if (!this.visible || 0 == this.alpha) return;
			
			var c = this._g.context;
			var sx = this.scaleX;
			var sy = this.scaleY;
			var rsx = 1 / sx;
			var rsy = 1 / sy;
			var x = this._mx;
			var y = this._my;
			var rot = this.rotation * Math.PI / 180;
			
			this.applyTransform(c, rot, sx, sy, x, y);
			
			this.drawNest();
			
			this.restoreTransform(c, -rot, rsx, rsy, -x, -y)
		})
		
		def(function applyTransform(ctx, rot, sx, sy, tx, ty) {
			ctx.translate(tx, ty);
			ctx.scale(sx, sy);
			ctx.rotate(rot);
		})
		
		def(function restoreTransform(ctx, rot, sx, sy, tx, ty) {
			ctx.rotate(rot);
			ctx.scale(sx, sy);
			ctx.translate(tx, ty);
		})
		
		def(function drawNest() {
			this._g.playback();
		})
		
		def(function getObjectsUnderPoints(px, py, results) {
			if (!this.visible || 0 == this.alpha) return;
			
			var stg = this._stg;
			var c = stg.context;
			
			var sx = this.scaleX;
			var sy = this.scaleY;
			var rsx = 1 / sx;
			var rsy = 1 / sy;
			var x = this._mx;
			var y = this._my;
			var rot = this.rotation * Math.PI / 180;
			
			c.clearRect(0, 0, stg.stageWidth, stg.stageHeight);
			this.applyTransform(c, rot, sx, sy, x, y);
			this._g.playback();
			var hasPixel = c.getImageData(px, py, 1, 1).data[3];;
			if (hasPixel) results.push(this);
			else if (this._mouseOvered) this._mouseOutFlag = true;
			this.getObjectsUnderPointsNest(px, py, results);
			
			this.restoreTransform(c, -rot, rsx, rsy, -x, -y)
		})
		
		def(function getObjectsUnderPointsNest(px, py, results) {
			
		})
		
		
		/** x 座標. [read-write] */
		getter("x", function() {return this._mx * this._sx})
		setter("x", function(val) {this._mx = val;})
		/** y 座標. [read-write] */
		getter("y", function() {return this._my * this._sy})
		setter("y", function(val) {this._my = val})
		
		/** 幅. [read-only] */
		getter("width", function() {return this._g.boundWidth * this._sx})
		/** 高さ. [read-only] */
		getter("height", function() {return this._g.boundHeight * this._sy})
		
		/** x scale. [read-write] */
		getter("scaleX", function() {
			return this._sx;
		})
		setter("scaleX", function(val) {
			this.graphics.boundWidth *= val;
			this._sx = val;
		})
		getter("globalScaleX", function() {
			return this._sx * (this.parent ? this.parent.globalScaleX : 1);
		})
		/** y scale. [read-write] */
		getter("scaleY", function() {
			return this._sy;
		})
		setter("scaleY", function(val) {
			this.graphics.boundHeight *= val;
			this._sy = val;
		})
		getter("globalScaleY", function() {
			return this._sy * (this.parent ? this.parent.globalScaleY : 1);
		})
		
		/** rotation. [read-write] */
		getter("rotation", function() {
			return this._rotation;
		})
		setter("rotation", function(rot) {
			this._rotation = rot;
		})
		
		getter("globalX", function() {
			if (this.parent == undefined) return this._mx;
			return this._mx + this.parent.globalX;
		})
		getter("globalY", function() {
			if (this.parent == undefined) return this._my;
			return this._my +  this.parent.globalY;
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
			if (this._stg) {
				child._stg = this._stg;
				child.addedToStage();
			}
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
			if (this._stg) {
				child._stg = this._stg;
				child.addedToStage();
			}
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
					child._stg = null;
					child.parent = null;
					child.removeFromStage();
					return 0;
				}
				i++;
			}, this);
		})
		
		def(function getChildAt(index) {
			return this.children[index];
		})
		
		
		def(function drawNest() {
			this.$super();
			this.numChildren.times(function (i) {
				this.children[i].draw();
			}, this)
		})
		
		def(function addedToStage() {
			this.$super();
			
			var children = this.children;
			for (var i = 0, l = this.numChildren; i < l; i++) {
				var child = children[i];
				child._stg = this._stg;
				child.addedToStage();
			}
		})
		
		def(function removeFromStage() {
			this.$super();
			
			for (var i = 0, l = this.numChildren; i < l; i++) {
				var child = this.children[i];
				child.removeFromStage();
				child._stg = null;
			}
		})

		def(function getObjectsUnderPointsNest(px, py, results) {
			for (var i = this.numChildren - 1; 0 <= i; i--) {
				this.getChildAt(i).getObjectsUnderPoints(px, py, results);
			}
		})
		
		/** 
		* このDisplayObjectContainerの子である表示オブジェクトの数.　[read-only]
		*/
		getter("numChildren", function() {return this.children.length;});
		
		getter("width", function() {
			var w = this._g.boundWidth;
			var children = this.children;
			var s = this._sx;
			for (var i = 0, l = children.length; i < l; i++) {
				var child = children[i];
				w = Math.max(child.x + child.width * s, w);
			}
			return w;
		})
		
		getter("height", function() {
			var h = this._g.boundHeight;
			var children = this.children;
			var s = this._sy;
			for (var i = 0, l = children.length; i < l; i++) {
				var child = children[i];
				h = Math.max(child.x + child.height * s, h);
			}
			return h;
		})
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
			this.$super();
			
			var context = canvas.getContext("2d");
			if (context == null) {
				console.error("Your browser hasn't support HTML5 Canvas.")
				return;
			}
			this.canvas = canvas;
			context.textBaseline = "top"
			context.textAlign = "left";
			
			this.context = context;
			this.w = canvas.width;
			this.h = canvas.height;
			this._stg = this;
			this._g.context = context;

			this._mouseOverIntervalID = null;
			this._objectsUnderPointer = [];
			this._currentMouseOveredObjects = [];
			
			if (new Namespace(namespace_lib_platform + ".browser").UserAgent.gen().isMobile())
				this.enableTouchEvents();
			else
				this.enableMouseEvents();
		})
		
		def(function addChild(child) {
			this.numChildren.times(function (i) {
				if (this.children[i] == child) this.children.splice(i, 1);
			}, this);
			this.children.push(child);
			child.parent = this;
			child._stg = this._stg;
			child.addedToStage();
		})
		
		// draw {replace the description here}.
		def(function draw() {
			this.context.clearRect(0, 0, this.stageWidth, this.stageHeight);
			var l = this.numChildren;
			for (var i = 0; i < l; i++) {
				this.children[i].draw();
			}
		})
		
		def(function drawNest() {
			
		})
		
		/** Stage の幅です. [read-only] */
		getter("stageWidth", function() {return this.w});
		/** Stage の高さです. [read-only] */
		getter("stageHeight", function() {return this.h});
		
		def(function disableMouseOver() {
			clearinterval(this._mouseOverIntervalID);
			this._mouseOverIntervalID = null;
		})
		
		def(function enableMouseOver(checkFreq) {
			if (this._mouseOverIntervalID) return;
			var self = this;
			var app = new Namespace(namespace_lib_app).Application.getInstance();
			var oup = this._objectsUnderPointer;
			var E = nsevent.FLMouseEvent;
			var currentOvered = this._currentMouseOveredObjects;
			this._mouseOverIntervalID = setInterval(function() {
				if (app.canTrackMouse) {
					oup.splice(0, oup.length);
					self.getObjectsUnderPoints(app.mouseX, app.mouseY, oup);
					self.draw();
					if (oup.length) {
						for (var i = oup.length - 1; 0 <= i; i--) {
							var o = oup[i];
							if (!o._mouseOvered && o.hasEventListener(E.MOUSE_OVER)) { 
								o.dispatchEvent(E.gen(E.MOUSE_OVER, o));
								o._mouseOvered = true;
								currentOvered.push(o);
								if (!o.mouseChildren) break;
							}
						}
					}
				}

				for (var i = 0, l = currentOvered.length; i < l; i++) {
					var overed = currentOvered[i];
					
					if (overed._mouseOutFlag) {
						if (overed.hasEventListener(E.MOUSE_OUT)) overed.dispatchEvent(E.gen(E.MOUSE_OUT, o));
						overed._mouseOutFlag = false;
						overed._mouseOvered = false;
						currentOvered.splice(i, 1);
						i--;
						l--;
					}
					
				}
			}, 1000 / checkFreq);
		})
		
		def(function enableMouseEvents() {
			var util = new Namespace(namespace_lib_core).Utilitie.gen();
			var self = this;
			var oup = self._objectsUnderPointer;
			var E = nsevent.FLMouseEvent;
			
			util.listen(this.canvas, nsevent.DOMMouseEvent.CLICK, function(e) {
				oup.splice(0, oup.length);
				self.getObjectsUnderPoints(e.clientX, e.clientY, oup);
				for (var i = oup.length - 1; 0 <= i; i--) {
					var o = oup[i];
					if (o.hasEventListener(E.CLICK)) {
						o.dispatchEvent(E.gen(E.CLICK, o));
						if (!o.mouseChildren) break;
					}
				}
				self.draw();
			})
			
			util.listen(this.canvas, nsevent.DOMMouseEvent.MOUSE_DOWN, function(e) {
				oup.splice(0, oup.length);
				var mouseX = e.clientX;
				var mouseY = e.clientY;
				self.getObjectsUnderPoints(mouseX, mouseY, oup);
				for (var i = oup.length - 1; 0 <= i; i--) {
					var o = oup[i];
					if (o.hasEventListener(E.MOUSE_DOWN)) {
						var e = nsevent.FLEvent.gen(E.MOUSE_DOWN, o);
						
						var pos = new Namespace(namespace_lib_geom).Matrix.gen();
						pos.tx = mouseX;
						pos.ty = mouseY;
						
						var mat = new Namespace(namespace_lib_geom).Matrix.gen();
						var sx = o.scaleX;
						var sy = o.scaleY;
						var rsx = 1 / sx;
						var rsy = 1 / sy;
						var x = o._mx;
						var y = o._my;
						var rot = o.rotation * Math.PI / 180;
						mat.translate(-x, -y);
						mat.scale(sx, sy);
						mat.rotate(rot);
						
						pos.concat(mat);
						e.mouseX = pos.tx;
						e.mouseY = pos.ty;
						
						o.dispatchEvent(e);
						if (!o.mouseChildren) break;
					}
				}
				self.draw();
			})
			
			util.listen(this.canvas, nsevent.DOMMouseEvent.MOUSE_UP, function(e) {
				oup.splice(0, oup.length);
				self.getObjectsUnderPoints(e.clientX, e.clientY, oup);
				for (var i = oup.length - 1; 0 <= i; i--) {
					var o = oup[i];
					if (o.hasEventListener(E.MOUSE_UP)) {
						o.dispatchEvent(nsevent.FLEvent.gen(E.MOUSE_UP, o));
						if (!o.mouseChildren) break;
					}
				}
				self.draw();
			})
		})
		
		def(function enableTouchEvents() {
			var util = new Namespace(namespace_lib_core).Utilitie.gen();
			var self = this;
			var oup = self._objectsUnderPointer;
			var E = nsevent.TouchEvent;
			
			util.listen(this.canvas, E.TOUCH_START, function(e) {
				oup.splice(0, oup.length);
				self.getObjectsUnderPoints(e.pageX, e.pageY, oup);
				for (var i = oup.length - 1; 0 <= i; i--) {
					var o = oup[i];
					if (o.hasEventListener(E.TOUCH_START)) {
						o.dispatchEvent(E.gen(E.TOUCH_START, o));
						if (!o.mouseChildren) break;
					}
				}
				self.draw();
			})
			
			util.listen(this.canvas, E.TOUCH_END, function(e) {
				oup.splice(0, oup.length);
				var touch = e.changedTouches[0];
				self.getObjectsUnderPoints(touch.pageX, touch.pageY, oup);
				for (var i = oup.length - 1; 0 <= i; i--) {
					var o = oup[i];
					if (o.hasEventListener(E.TOUCH_END)) {
						o.dispatchEvent(E.gen(E.TOUCH_END, o));
						if (!o.mouseChildren) break;
					}
				}
				self.draw();
			})
		})
		
	})
	
	/**
	* @class Text
	**/
	proto(function Text() {
		ex(ns.DisplayObject);
		
		init(function() {
			this.$super();
			this._text = "";
			this._fontFamily = "_sans";
			this._fontSize = 12;
			this._bold = false;
			this._italic = false;
			this._color = 0x000000;
			this._lock = false;
		})
		
		def(function lock() {
			this._lock = true;
		})
		
		def(function unlock() {
			this._lock = false;
		})
		
		def(function applyFormat() {
			this.graphics.clear();
			this.graphics.beginFill(this._color);
			this.graphics.lineStyle(0);
			this.graphics.setFormat(formatString(this._fontFamily, this._fontSize, this._bold, this._italic));
			this.graphics.drawText(this._text);
		})
		
		getter("text", function() {
			return this._text;
		})
		setter("text", function(txt) {
			this.graphics.clear();
			this.graphics.beginFill(this._color);
			this.graphics.lineStyle(0);
			this.graphics.setFormat(formatString(this._fontFamily, this._fontSize, this._bold, this._italic));
			this.graphics.drawText(txt);
			this._text = txt;
		})
		
		getter("fontSize", function() {return this._fontSize});
		setter("fontSize", function(size) {
			this._fontSize = size;
			this.applyFormat();
		})
		
		getter("fontFamily", function() {
			return this._fontFamily;
		})
		setter("fontFamily", function(fam) {
			this._fontFamily = fam;
			this.applyFormat();
		})
		
		getter("bold", function() {return this._bold});
		setter("bold", function(val) {
			this._bold = val;
			this.applyFormat();
		})
		
		getter("italic", function() {return this._italic});
		setter("italic", function(val) {
			this._italic = val;
			this.applyFormat();
		})
		
		getter("color", function() {return this._color});
		setter("color", function(val) {
			this._color = val;
			this.applyFormat();
		})
		
		getter("width", function() {
			return this.graphics.boundWidth;
		})
		
		function formatString(family, size, bold, italic) {
			return bold ? "bold " : ""  + size + "px " + family;
		}
	})
	
	/**
	* @class Image
	**/
	proto(function Image() {
		ex(ns.DisplayObject)
		
		init(function(imageElement) {
			this.$super();
			this._imageElement = imageElement;
			this.graphics.drawImage(this._imageElement);
		})
		
		getter("width", function() {
			return this._imageElement.width * this._sx;
		})
		getter("height", function() {
			return this._imageElement.height * this._sy;
		})
	})
	
	
	/**
	* @class ImageManager
	**/
	singleton(function ImageManager() {
		ex(nsevent.EventDispatcher);
		
		init(function() {
			this.cache = {};
			this._currentToLoadCount = 0;
			this._currentLoadedCount = 0;
		})
		
		def(function load(resourcePaths) {
			if (this.nowLoading) {
				console.warn("ImageManager \"load\" has currently working")
				return;
			}

			var l = resourcePaths.length;
			this._nowLoading = true;
			this._currentToLoadCount = l;
			this._currentLoadedCount = 0;
			
			l.times(function(i) {
				var img = new Image();
				img.src = resourcePaths[i];
				img.onload = this.onLoadAImage;
			}, this)
		})
		
		def(function onLoadAImage(e) {
			var _this = ns.ImageManager.getInstance();
			var img = e.currentTarget;
			img.onload = null;
			//var name = /:\/\/.*?(\/.*)/g.exec(img.src)[1];
			var name = img.src;
			_this._currentLoadedCount++;
			_this.cache[name] = img;
			if (_this._currentLoadedCount == _this._currentToLoadCount) {
				_this._nowLoading = false;
				_this.dispatchEvent(nsevent.FLEvent.gen(nsevent.FLEvent.COMPLETE));
				_this._currentToLoadCount = 0;
				_this._currentLoadedCount = 0;
			}
			
		})
		
		def(function getImageByName(name) {
			return this.cache[name];
		})
		
		def(function del(name) {
			delete this.cache[name];
		})
		
	})
	
})