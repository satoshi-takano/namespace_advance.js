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
* @fileOverview Set of prototypes related to the canvas.
* @version 0.6.0
*/ 

/** 
* @namespace advanced.canavs
*/
new Namespace("advanced.canvas").require(["advanced.core", "advanced.application", "advanced.geom", "advanced.events", "advanced.platform"], function() {
	this.use(function() {
		console.log('imported ', this.nsName)
		
		var ns = this;
		var nscore = new Namespace("advanced.core");
		var nsevent = new Namespace("advanced.events");
		var nsgeom = new Namespace("advanced.geom");
		var app = new Namespace("advanced.application").Application.getInstance();

		if (global.CanvasRenderingContext2D && 
		    !CanvasRenderingContext2D.prototype.createImageData && 
		    global.ImageData) {
		  	CanvasRenderingContext2D.prototype.createImageData = function(w,h) {
		    return new ImageData(w,h) 
		  };
		}
		var globalCtx = global.CanvasRenderingContext2D;

		/**
		* The Color object.
		* @class Color
		* @param {number} col16 The color value as hexadecimal.
		**/
		proto(function Color() {
			init(function(col16) {
				this.color = col16;
			})

			/** 
			* The red value.
			* @member r {number}
			* @memberOf Color#
			**/
			getter("r", function() {
				return this.color >> 16;
			})
			setter("r", function(val) {
				this.color = val << 16 | this.g << 8 | this.b;
			})

			/** 
			* The green value.
			* @member r {number}
			* @memberOf Color#
			**/
			
			getter("g", function() {
				return this.color >> 8 & 0xff;
			})
			setter("g", function(val) {
				this.color = this.r << 16 | this.b << 8 | this.b;
			})

			/** 
			* The blue value.
			* @member r {number}
			* @memberOf Color#
			**/
			
			getter("b", function() {
				return this.color & 0xff;
			})
			setter("b", function(val) {
				this.color = this.r << 16 | this.g << 8 | val;
			})
		})

		/**
		* @class BitmapData
		* @deprecated
		**/
		proto(function BitmapData() {
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
		* The CapStyle object.
		* @class CapStyle
		**/
		singleton(function CapStyle() {
			init(function() {
			})
			/** 
			* @constant {string} NONE
			* @memberOf CapStyle
			*/
			$$.NONE = "butt";
			/** 
			* @constant {string} ROUND
			* @memberOf CapStyle
			*/
			$$.ROUND = "round";
			/** 
			* @constant {string} SQUARE
			* @memberOf CapStyle
			*/
			$$.SQUARE = "square";
		})

		/**
		* The JointStyle object.
		* @class JointStyle
		**/
		singleton(function JointStyle() {
			init(function(args) {
			})
			/** 
			* @constant {string} BEVEL
			* @memberOf JointStyle
			*/
			$$.BEVEL = "bevel";
			/** 
			* @constant {string} MITER
			* @memberOf JointStyle
			*/
			$$.MITER = "miter";
			/** 
			* @constant {string} ROUND
			* @memberOf JointStyle
			*/
			$$.ROUND = "round";
		})

		/**
		* This document is undeveloped.
		* @class Graphics
		* @augment Recordable
		* @deprecated
		**/
		proto(function Graphics() {
			ex(nscore.Recordable)

			init(function() {
				this.$super();

				this.context = null;
				this.needStroke = false;
				this.needFill = false;

				// initialize context
				var op = new nscore.Operation(this, ctxInit);
				this.rec(op);

				this.boundWidth = 0;
				this.boundHeight = 0;
			});

			/** @deprecated **/
			def(function beginBitmapFill(bmd, matrix, repeat) {
			})

			/**
			* @param {number} color 
			* @parma {number} alpha
			*/
			def(function beginFill(color, alpha) {
				if (alpha == undefined) alpha = 1;
				var col = new ns.Color(color);
				var style = "rgba(" + col.r + "," + col.g + "," + col.b + "," + alpha +")";

				this.rec(new nscore.Operation(this, ctxNeedFill, [true]))
				this.rec(new nscore.Operation(this, ctxSetFillStyle, [style]));
			})
			
			/** @deprecated **/
			def(function beginGradientFill(type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod) {

			})

			/**
			* @param cpx {Number} コントロールポイントの x 値　
			* @param cpy {Number} コントロールポイントの y 値　
			* @param ax {Number} アンカーポイントの x 値
			* @param ay {Number} アンカーポイントの y 値
			*/
			def(function curveTo(cpx, cpy, ax, ay) {
				this.rec(new nscore.Operation(this, ctxCurveTo, [cpx, cpy, ax, ay]));
			})

			/**
			* 円を描画します.
			* @param x {Number} 円の中心の x 座標
			* @param y {Number} 円の中心の y 座標
			* @param r {Number} 円の半径
			*/
			def(function drawCircle(x, y, r) {
				this.rec(new nscore.Operation(this, ctxArc, [x, y, r]));
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
				this.rec(new nscore.Operation(this, ctxFillRect, [x, y, w, h]));
				updateBound.call(this, x + w, y + h);
			})

			def(function drawRoundRect(x, y, w, h, ellipseW, ellipseH) {

			})

			/** 塗を終了します. */
			def(function endFill() {
				this.rec(new nscore.Operation(this, ctxEndFill));
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
				var col = new ns.Color(color);
				var style = "rgba(" + col.r + "," + col.g + "," + col.b + "," + alpha +")";
				var op = new nscore.Operation(this, ctxSetLineStyle, [thickness, style, caps, joints, miterLimit]);
				this.rec(op);
			})

			/** 
			* 線を引きます.
			* @param x {Number}
			* @param y {Number}
			*/
			def(function lineTo(x, y) {
				var op = new nscore.Operation(this, ctxLineTo, [x, y]);
				this.rec(op);
				updateBound.call(this, x, y);
			})

			/**
			* ペン先を移動します.
			* @param x {Number}
			* @param y {Number}
			*/
			def(function moveTo(x, y) {
				this.rec(new nscore.Operation(this, ctxMoveTo, [x, y]));
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
				this.rec(new nscore.Operation(this, ctxBezierCurveTo, [cp1x, cp1y, cp2x, cp2y, x, y]));
			})

			/**
			* ビットマップ画像を指定座標に転写します.
			* @param img {Image} DOM の Image element
			* @param x {Number} 
			* @param y {Number}
			*/
			def(function drawImage(img) {
				this.rec(new nscore.Operation(this, ctxDrawImage, [img]));
				updateBound.call(this, img.width, img.height);
			})

			def(function setFormat(formatString) {
				this.rec(new nscore.Operation(this, ctxSetFormat, [formatString]));
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
				this.rec(new nscore.Operation(this, ctxDrawText, [text]));
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
				c.quadraticCurveTo(cpx, cpy, ax, ay);
				if (this.needFill) this.context.fill();
				if (this.needStroke) c.stroke();
			}

			function ctxFillRect(x, y, w, h) {
				var c = this.context;
				c.beginPath();
				this.context.fillRect(x, y, w, h);
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
		* The DisplayObject looks like the DisplayObject class of ActionScript3.0.
		* @class DisplayObject
		* @augments EventDispatcher
		**/
		proto(function DisplayObject() {
			ex(nsevent.EventDispatcher);
			var ii = 0
			init(function() {
				this.$super();

				this._mx = 0, this._my = 0;
				this._g = new ns.Graphics();
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
			
			/**
			* This method observes the added to stage event of this object.
			* @method addedToStage
			* @memberOf DisplayObject#
			**/
			def(function addedToStage() {
				this._g.context = this._stg.context;
			})
			
			/**
			* This method observes the removed to stage event of this object.
			* @method addedToStage
			* @memberOf DisplayObject#
			**/
			def(function removeFromStage() {
				this._g.context = null;
			})

			/**
			* Draws the graphics.
			* @method draw
			* @memberOf DisplayObject#
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
			
			/** @private **/
			def(function applyTransform(ctx, rot, sx, sy, tx, ty) {
				ctx.translate(tx, ty);
				ctx.scale(sx, sy);
				ctx.rotate(rot);
			})

			/** @private **/
			def(function restoreTransform(ctx, rot, sx, sy, tx, ty) {
				ctx.rotate(rot);
				ctx.scale(sx, sy);
				ctx.translate(tx, ty);
			})

			/**
			* The drawing function that will called in transformed context.
			* @method drawNest
			* @memberOf DisplayObject#
			* @protected
			**/
			def(function drawNest() {
				this._g.playback();
			})
			
			/**
			* Determines whether the point that passed to the arguments is contained the rendered region.
			* @method getObjectsUnderPoints
			* @memberOf DisplayObject#
			* @param {number} px The x coordinates.
			* @param {number} py The y coordinates.
			* @param {array} results The objects that contains the point passed to arguments.
			**/
			def(function getObjectsUnderPoints(px, py, results) {
				if (!this.visible || 0 == this.alpha) return;

				var stg = this._stg;
				var c = stg.context;

				c.clearRect(0, 0, stg.stageWidth, stg.stageHeight);
                // this._g.playback();
                this.draw();
				var hasPixel = c.getImageData(px, py, 1, 1).data[3];
				if (hasPixel) results.push(this);
				else if (this._mouseOvered) this._mouseOutFlag = true;
				this.getObjectsUnderPointsNest(px, py, results);
			})
            
			/** @deprecated **/
			def(function getObjectsUnderPointsNest(px, py, results) {

			})

			/** @deprecated **/
			def(function capture() {
				var img = this.stage.context.getImageData(this.x, this.y, this.width, this.height);
				return img;
			})

			/** 
			* The x corrdinate of the DisplayObject.
			* @member {number} x
			* @memberOf DisplayObject#
			**/
			getter("x", function() {return this._mx * this._sx})
			setter("x", function(val) {this._mx = val;})
			/** 
			* The y corrdinate of the DisplayObject.
			* @member {number} y
			* @memberOf DisplayObject#
			**/
			getter("y", function() {return this._my * this._sy})
			setter("y", function(val) {this._my = val})

			/** 
			* The width of the DisplayObject.
			* @member {number} width
			* @memberOf DisplayObject#
			**/
			getter("width", function() {return this._g.boundWidth * this._sx})
			setter("width", function(v) {this._g.boundWidth = v;})
			/** 
			* The height of the DisplayObject.
			* @member {number} height
			* @memberOf DisplayObject#
			**/
			getter("height", function() {return this._g.boundHeight * this._sy})
			setter("height", function(v) {this._g.boundHeight = v;})

			/** 
			* The horizontal scale of the DisplayObject.
			* @member {number} scaleX
			* @memberOf DisplayObject#
			**/
			getter("scaleX", function() {
				return this._sx;
			})
			setter("scaleX", function(val) {
				this.graphics.boundWidth *= val;
				this._sx = val;
			})
			/** @private **/
			getter("globalScaleX", function() {
				return this._sx * (this.parent ? this.parent.globalScaleX : 1);
			})
			/** 
			* The vertical scale of the DisplayObject.
			* @member {number} scaleY
			* @memberOf DisplayObject#
			**/
			getter("scaleY", function() {
				return this._sy;
			})
			setter("scaleY", function(val) {
				this.graphics.boundHeight *= val;
				this._sy = val;
			})
			/** @private **/
			getter("globalScaleY", function() {
				return this._sy * (this.parent ? this.parent.globalScaleY : 1);
			})

			/** 
			* The rotaion of the DisplayObject.
			* @member {number} rotation
			* @memberOf DisplayObject#
			**/
			getter("rotation", function() {
				return this._rotation;
			})
			setter("rotation", function(rot) {
				this._rotation = rot;
			})
			
			/** 
			* The global x coordinate of the DisplayObject.
			* @member {number} globalX
			* @memberOf DisplayObject#
			* @readonly
			**/
			getter("globalX", function() {
				if (this.parent == undefined) return this._mx;
				return this._mx + this.parent.globalX;
			})
			/** 
			* The global y coordinate of the DisplayObject.
			* @member {number} globalX
			* @memberOf DisplayObject#
			* @readonly
			**/
			getter("globalY", function() {
				if (this.parent == undefined) return this._my;
				return this._my +  this.parent.globalY;
			})
			
			/** 
			* The stage object that contains this DisplayObject.
			* @member {Stage} stage
			* @memberOf DisplayObject#
			* @readonly
			**/
			getter("stage", function () {
				return this._stg;
			})
			
			/** 
			* The graphic context object of the DisplayObject.
			* @member {number} grpahics
			* @memberOf DisplayObject#
			* @readonly
			**/
			getter("graphics", function() {return this._g})
			
			/** 
			* The mouse x coordinate that is measured in this DipslayObject's region.
			* @member {number} mouseX
			* @memberOf DisplayObject#
			* @readonly
			**/
			getter("mouseX", function() {
				return app.mouseX - this.globalX;
			})
			/** 
			* The mouse y coordinate that is measured in this DipslayObject's region.
			* @member {number} mouseX
			* @memberOf DisplayObject#
			* @readonly
			**/
			getter("mouseY", function() {
				return app.mouseY - this.globalY;
			})
		})

		/**
		* The DisplayObjectContainer looks like the DisplayObjectContainer class of ActionScript3.0.
		* @class DisplayObjectContainer
		* @augments DisplayObject
		**/
		proto(function DisplayObjectContainer() {
			ex(ns.DisplayObject)

			init(function() {
				this.$super();
				this.children = [];
				this._stg = null;
			})

			/**
			* Adds the DisplayObject to display tree of this object.
			* @method addChild
			* @memberOf DisplayObjectContainer#
			* @param {DisplayObject} child
			**/
			def(function addChild(child) {
				var l = this.numChildren;
				for (var i = 0; i < l; i++) {
					if (this.children[i] == child) this.children.splice(i, 1);
				}
				this.children.push(child);
				child.parent = this;
				if (this._stg) {
					child._stg = this._stg;
					child.addedToStage();
				}
			})

			/**
			* Adds the DisplayObject to display tree of this object, and specifies the z-index of the child.
			* @method addChildAt
			* @memberOf DisplayObjectContainer#
			* @param {DisplayObject} child
			* @param {number} The child's index
			**/
			def(function addChildAt(child, index) {
				var numChildren = this.numChildren;
				var l = this.numChildren;
				for (var i = 0; i < l; i++) {
					if (this.children[i] == child) this.children.splice(i, 1);
				}
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
			* Removes the DisplayObject from display tree of this object.
			* @method removeChild
			* @memberOf DisplayObjectContainer#
			* @param {DisplayObject} child
			**/
			def(function removeChild(child) {
				var l = this.numChildren;
				for (var i = 0; i < l; i++) {
                    var c = this.children[i];
					if (c == child) {
						this.children.splice(i, 1);
						child._stg = null;
						child.parent = null;
						child.removeFromStage();
						return 0;
					}
				}
			})

			/**
			* Returns the child DisplayObject in display tree of this object by the z-index.
			* @method getChildAt
			* @memberOf DisplayObjectContainer#
			* @param {DisplayObject} child
			**/
			def(function getChildAt(index) {
				return this.children[index];
			})

			def(function drawNest() {
				this.$super();
				var l = this.numChildren;
				for (var i = 0; i < l; i++) {
					this.children[i].draw();
				}
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
			* The number of children in the display tree of this object.
			* @member {number} numChildren
			* @memberOf DisplayObjectContainer#
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
		* The Stage looks like the Stage class of ActionScript3.0.
		* @class Stage
		* @augments DisplayObjectContainer
		* @param {object} The HTML canvs element.
		**/
		proto(function Stage() {
			ex(ns.DisplayObjectContainer);

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

				if (new (new Namespace("advanced.platform")).UserAgent().isMobile())
					this.enableTouchEvents();
				else
					this.enableMouseEvents();
                    
                this._enabled = true;
                this._enableTouchStart = true;

				this._canvasCSSScaledRatio = 1;
			})

            def(function enable() {
                this._enabled = true;
            })
            
            def(function disable() {
                this._enabled = false;
            })
            
            getter("enableTouchStart", function() {
                return this._enableTouchStart;
            })
            setter("enableTouchStart", function(b) {
                this._enableTouchStart = b;
            })

			getter("canvasCSSScaledRatio", function() {
				return this._canvasCSSScaledRatio;
			})
			setter("canvasCSSScaledRatio", function(s) {
				this._canvasCSSScaledRatio = s;
			})

			def(function addChild(child) {
				var l = this.numChildren;
				for (var i = 0; i < l; i++) {
					if (this.children[i] == child) this.children.splice(i, 1);
				}
				this.children.push(child);
				child.parent = this;
				child._stg = this._stg;
				child.addedToStage();
			})

			def(function draw() {
                if (this._enabled == false) return;
                
				this.context.clearRect(0, 0, this.stageWidth, this.stageHeight);
				var l = this.numChildren;
				for (var i = 0; i < l; i++) {
					this.children[i].draw();
				}
			})
			
			/**
			* Clears the graphics that drawn to the stage.
			* @method clear
			* @memberOf Stage#
			**/
			def(function clear() {
				this.context.clearRect(0, 0, this.stageWidth, this.stageHeight);
			})

			def(function drawNest() {
			})

			/** 
			* The width of the stage.
			* @member {number} stageWidth
			* @memberOf Stage#
			* @readonly
			**/
			getter("stageWidth", function() {return this.w});
			/** 
			* The height of the stage.
			* @member {number} stageHeight
			* @memberOf Stage#
			* @readonly
			**/
			getter("stageHeight", function() {return this.h});
			
			/** 
			* Sets to disabled the mouse over.
			* @method disableMouseOver
			* @memberOf Stage#
			**/
			def(function disableMouseOver() {
				clearinterval(this._mouseOverIntervalID);
				this._mouseOverIntervalID = null;
			})

			/** 
			* Sets to enabled the mouse over.
			* @method enableMouseOver
			* @memberOf Stage#
			**/
			def(function enableMouseOver(checkFreq) {
				if (this._mouseOverIntervalID) return;
				var self = this;
				var app = new Namespace("advanced.application").Application.getInstance();
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
									o.dispatchEvent(new E(E.MOUSE_OVER, o));
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
							if (overed.hasEventListener(E.MOUSE_OUT)) overed.dispatchEvent(new E(E.MOUSE_OUT, o));
							overed._mouseOutFlag = false;
							overed._mouseOvered = false;
							currentOvered.splice(i, 1);
							i--;
							l--;
						}

					}
				}, 1000 / checkFreq);
			})
			
			/** 
			* Sets to enabled the mouse events.
			* @method enableMouseEvents
			* @memberOf Stage#
			**/
			def(function enableMouseEvents() {
				var util = new (new Namespace("foundation")).Utilitie();
				var self = this;
				var oup = self._objectsUnderPointer;
				var E = nsevent.FLMouseEvent;

				util.listen(this.canvas, nsevent.DOMMouseEvent.CLICK, function(e) {
                    if (self._enabled == false) return;
                   
					oup.splice(0, oup.length);
                    var pos = $(self.canvas).offset();
                    var _x = e.pageX - pos.left;
                    var _y = e.pageY - pos.top;

					var scl = self._canvasCSSScaledRatio;
					self.context.scale(scl, scl);
					self.getObjectsUnderPoints(_x, _y, oup);
					scl = 1/scl;
					self.context.scale(scl, scl);
					for (var i = oup.length - 1; 0 <= i; i--) {
						var o = oup[i];
						if (o.hasEventListener(E.CLICK)) {
							o.dispatchEvent(new E(E.CLICK, o));
							if (!o.mouseChildren) break;
						}
					}
					self.draw();
				})

				util.listen(this.canvas, nsevent.DOMMouseEvent.MOUSE_DOWN, function(e) {
                    if (self._enabled == false || self._enableTouchStart == false) return;
                    
					oup.splice(0, oup.length);
					var mouseX = e.clientX;
					var mouseY = e.clientY;

					var scl = self._canvasCSSScaledRatio;
					self.context.scale(scl, scl);
					self.getObjectsUnderPoints(mouseX, mouseY, oup);
					scl = 1/scl;
					self.context.scale(scl, scl);

					for (var i = 0, len = oup.length; i < len; i++) {
						var o = oup[i];
						if (o.hasEventListener(E.MOUSE_DOWN)) {
							var e = new nsevent.FLEvent(E.MOUSE_DOWN, o, e);

							var pos = new (new Namespace("advanced.geom")).Matrix();
							pos.tx = mouseX;
							pos.ty = mouseY;

							var mat = new (new Namespace("advanced.geom")).Matrix();
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

							if (!e.doBubbling || !o.mouseChildren) break;
						}
					}
					self.draw();
				})

				util.listen(this.canvas, nsevent.DOMMouseEvent.MOUSE_UP, function(e) {
                    if (self._enabled == false) return;
                    
					oup.splice(0, oup.length);

					var scl = self._canvasCSSScaledRatio;
					self.context.scale(scl, scl);
					self.getObjectsUnderPoints(e.clientX, e.clientY, oup);
					scl = 1/scl;
					self.context.scale(scl, scl);
					
					for (var i = 0, len = oup.length; i < len; i++) {
						var o = oup[i];
						if (o.hasEventListener(E.MOUSE_UP)) {
							var e = new nsevent.FLEvent(E.MOUSE_UP, o, e);
							o.dispatchEvent(e);
							if (!e.doBubble || !o.mouseChildren) break;
						}
					}
					self.draw()
				})
			})

			/** 
			* Sets to enabled the touch events.
			* @method enableTouchEvents
			* @memberOf Stage#
			**/
			def(function enableTouchEvents() {
				var util = new (new Namespace("foundation")).Utilitie();
				var self = this;
				var oup = self._objectsUnderPointer;
				var E = nsevent.TouchEvent;

				util.listen(this.canvas, E.TOUCH_START, function(e) {
                    if (self._enabled == false || self._enableTouchStart == false) return;
                    
					oup.splice(0, oup.length);
                    var pos = $(self.canvas).offset();
                    var touch = e.changedTouches[0];
                    var _x = touch.pageX - pos.left;
                    var _y = touch.pageY - pos.top;

					var scl = self._canvasCSSScaledRatio;
					self.context.scale(scl, scl);
					self.getObjectsUnderPoints(_x, _y, oup);
					scl = 1/scl;
					self.context.scale(scl, scl);
					
					for (var i = oup.length - 1; 0 <= i; i--) {
						var o = oup[i];
						if (o.hasEventListener(E.TOUCH_START)) {
							o.dispatchEvent(new E(E.TOUCH_START, o));
							if (!o.mouseChildren) break;
						}
					}
					self.draw();
				})

				util.listen(this.canvas, E.TOUCH_END, function(e) {
                    if (self._enabled == false) return;
                    
					oup.splice(0, oup.length);
                    var pos = $(self.canvas).offset();
                    var touch = e.changedTouches[0];
                    var _x = touch.pageX - pos.left;
                    var _y = touch.pageY - pos.top;

					var scl = self._canvasCSSScaledRatio;
					self.context.scale(scl, scl);
					self.getObjectsUnderPoints(_x, _y, oup);
					scl = 1/scl;
					
					self.context.scale(scl, scl);

					for (var i = oup.length - 1; 0 <= i; i--) {
						var o = oup[i];
						if (o.hasEventListener(E.TOUCH_END)) {
							o.dispatchEvent(new E(E.TOUCH_END, o));
							if (!o.mouseChildren) break;
						}
					}
					self.draw();
				})
			})

		})

		/**
		* The Text object.
		* @class Text
		* @augments DisplayObject
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
			
			/** 
			* The string that has displayed in this.
			* @member {string} text
			* @memberOf Text#
			**/
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

			/** 
			* The font size.
			* @member {number} fontSize
			* @memberOf Text#
			**/
			getter("fontSize", function() {return this._fontSize});
			setter("fontSize", function(size) {
				this._fontSize = size;
				this.applyFormat();
			})

			/** 
			* The font family.
			* @member {string} fontFamily
			* @memberOf Text#
			**/
			getter("fontFamily", function() {
				return this._fontFamily;
			})
			setter("fontFamily", function(fam) {
				this._fontFamily = fam;
				this.applyFormat();
			})
			
			/** 
			* Whether this object uses bold font or not.
			* @member {boolean} bold
			* @memberOf Text#
			**/
			getter("bold", function() {return this._bold});
			setter("bold", function(val) {
				this._bold = val;
				this.applyFormat();
			})

			/** 
			* Whether this object uses italic font or not.
			* @member {boolean} italic
			* @memberOf Text#
			**/
			getter("italic", function() {return this._italic});
			setter("italic", function(val) {
				this._italic = val;
				this.applyFormat();
			})

			/** 
			* The color of the text.
			* @member {number} color 
			* @memberOf Text#
			**/
			getter("color", function() {return this._color});
			setter("color", function(val) {
				this._color = val;
				this.applyFormat();
			})
			
			/** 
			* The width of the text.
			* @member {number} width
			* @memberOf Text#
			**/
			getter("width", function() {
				return this.graphics.boundWidth;
			})

			function formatString(family, size, bold, italic) {
				return bold ? "bold " : ""  + size + "px " + family;
			}
		})

		/**
		* The Image object.
		* @class Image
		* @augments DisplayObject
		* @param {object} imageElement The html img element.
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
		* The ImageManager manages loading  and caching of the images.
		* @class ImageManager
		**/
		proto(function ImageLoader() {
			ex(nsevent.EventDispatcher);

			init(function(cache) {
				this.$super();

				this.cache = cache || {};
				this._currentLoadedCount = 0;
			})

			/**
			* Loads the image asynchronous. When it has finished loading, the ImageManger will dispatches a FLEvent.COMPLETE event.
			* @param {string} resourcePath The path of the image.
			**/
			def(function load(resourcePaths) {
				if (this.nowLoading) {
					console.warn("ImageLoader \"load\" has currently working")
					return;
				}

				var l = resourcePaths.length;
				this._nowLoading = true;
				this._currentToLoadCount = l;
                this._currentLoadedCount = 0;

				for (var i = 0; i < l; i++) {
					var img = new Image();
					img.src = img._name = resourcePaths[i];
					img.onload = loaded;
				}
                var _this = this;
                function loaded(e) {
                    _this.onLoadAImage(e);
                }
			})
			
			/** @private **/
			def(function onLoadAImage(e) {
				var _this = this;
				var img = e.currentTarget;
				img.onload = null;
                
				var name = img._name;
				_this._currentLoadedCount++;
                
				_this.cache[name] = img;
				if (_this._currentLoadedCount == _this._currentToLoadCount) {
					_this._nowLoading = false;
					_this._currentToLoadCount = 0;
                    _this._currentLoadedCount = 0;
					_this.dispatchEvent(new nsevent.FLEvent(nsevent.FLEvent.COMPLETE));
				}

			})
			
			/**
			* Returns the Image object by path of image.
			* @method getImageByName
			* @memberOf ImageManger#
			**/
			def(function getImageByName(name) {
				return this.cache[name];
			})
			
			/**
			* Delete the Image object by path of image.
			* @method del
			* @memberOf ImageManager#
			**/
			def(function del(name) {
				delete this.cache[name];
			})
		})
        
		/**
		* The ImageManager manages loading  and caching of the images.
		* @class ImageManager
		**/
		singleton(function ImageManager() {
			ex(nsevent.EventDispatcher);

			init(function() {
				this.$super();

				this.loader = new ns.ImageLoader();
			})

			/**
			* Loads the image asynchronous. When it has finished loading, the ImageManger will dispatches a FLEvent.COMPLETE event.
			* @param {string} resourcePath The path of the image.
			**/
			def(function load(resourcePaths) {
				this.loader.load(resourcePaths);
                var _this = this;
                this.loader.addEventListener(nsevent.FLEvent.COMPLETE, function() {
                    _this.dispatchEvent(new nsevent.FLEvent(nsevent.FLEvent.COMPLETE));
                })
			})
			
			/**
			* Returns the Image object by path of image.
			* @method getImageByName
			* @memberOf ImageManger#
			**/
			def(function getImageByName(name) {
				return this.loader.cache[name];
			})
			
			/**
			* Delete the Image object by path of image.
			* @method del
			* @memberOf ImageManager#
			**/
			def(function del(name) {
				delete this.loader.cache[name];
			})
		})
		
	});
})
