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
			var c = this.context;
			var metrics = c.measureText(text);
			updateBound.call(this, metrics.widht, 0);
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
		
		function ctxDrawImage(img) {
			this.context.drawImage(img, 0, 0);
		}
		
		function ctxSetFormat(formatString) {
			this.context.font = formatString;
		}
		
		function ctxDrawText(text) {
				this.context.fillText(text, 0, 0);
				this.context.strokeText(text, 0, 0);
		}
		
		function updateBound(x, y) {
			if (this.boundWidth < x) this.boundWidth = x;
			if (this.boundHeight < y) this.boundHeight = y;
		}
		// member
		def(function updateBound(w, h) {
			if (this.boundWidth < x) this.boundWidth = x;
			if (this.boundHeight < y) this.boundHeight = y;
		})
		
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
			this._rotation = 0;
		})
		
		def(function addedToStage() {

		})
		
		def(function removeFromStage() {

		})
		
		/**
		* 描画します.
		*/
		def(function draw() {
			var c = this._g.context;
			var sx = this.scaleX;
			var sy = this.scaleY;
			var rsx = 1 / sx;
			var rsy = 1 / sy;
			var x = this._mx * (1/sx);
			var y = this._my * (1/sy);
			
			c.scale(sx, sy);
			c.translate(x, y);
			
			if (this.visible) this._g.playback();
			
			c.translate(-x, -y);
			c.scale(rsx, rsy);
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
		
		// draw {replace the description here}.
		def(function draw() {
			var c = this._g.context;
			var sx = this.scaleX;
			var sy = this.scaleY;
			var rsx = 1 / sx;
			var rsy = 1 / sy;
			var x = this._mx * (1/sx);
			var y = this._my * (1/sy);
			
			c.scale(sx, sy);
			c.translate(x, y);
			
			if (this.visible) this._g.playback();
			this.numChildren.times(function (i) {
				this.children[i].draw();
			}, this)
			
			c.translate(-x, -y);
			c.scale(rsx, rsy);
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
			for (var i = 0, l = this.numChildren; i < l; i++) {
				var child = this.children[i];
				child.removeFromStage();
				child._stg = null;
			}
		})
		
		
		/** 
		* このDisplayObjectContainerの子である表示オブジェクトの数.　[read-only]
		*/
		getter("numChildren", function() {return this.children.length;});
		
		getter("width", function() {
			var w = 0;
			var children = this.children;
			var s = this._sx;
			for (var i = 0, l = children.length; i < l; i++) {
				var child = children[i];
				w = Math.max(child.x + child.width * s, w);
			}
			return w;
		})
		
		getter("height", function() {
			var h = 0;
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
			var context = canvas.getContext("2d");
			if (context == null) {
				console.error("Your browser hasn't support HTML5 Canvas.")
				return;
			}
			
			context.textBaseline = "top"
			context.textAlign = "left";
			
			this.context = context;
			this.w = canvas.width;
			this.h = canvas.height;
			this._stg = this;
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
			this.numChildren.times(function (i) {
				this.children[i].draw();
			}, this)
		})
		
		/** Stage の幅です. [read-only] */
		getter("stageWidth", function() {return this.w});
		/** Stage の高さです. [read-only] */
		getter("stageHeight", function() {return this.h});
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
			this.graphics.setFormat(formatString(this._fontFamily, this._fontSize, this._bold, this._italic));
		})
		
		getter("text", function() {
			return this._text;
		})
		setter("text", function(txt) {
			this.graphics.drawText(txt);
			this._text = txt;
		})
		
		getter("fontSize", function() {return this._fontSize});
		setter("fontSize", function(size) {
			this._fontSize = size;
		})
		
		getter("fontFamily", function() {
			return this._fontFamily;
		})
		setter("fontFamily", function(fam) {
			this._fontFamily = fam;
		})
		
		getter("bold", function() {return this._bold});
		setter("bold", function(val) {
			this._bold = val;
		})
		
		getter("italic", function() {return this._italic});
		setter("italic", function(val) {
			this._italic = val;
		})
		
		getter("color", function() {return this._color});
		setter("color", function(val) {
			this._color = val;
			this.graphics.beginFill(val);
		})
		
		function formatString(family, size, bold, italic) {
			return bold ? "bold " : ""  + size + " " + family;
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
	})
	
	
	/**
	* @class ImageManager
	**/
	singleton(function ImageManager() {
		ex(nsevent.EventDispatcher);
		
		init(function() {
			this.cache = {};
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
			var name = /:\/\/.*?(\/.*)/g.exec(img.src)[1];
			_this.cache[name] = img;
			if (_this._currentLoadedCount == _this._currentToLoadCount - 1) {
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