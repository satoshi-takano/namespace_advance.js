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
* @private 
* @deprecated
**/

new Namespace("advanced.display").use(function() {
	console.log('imported ', this.nsName)
	
	var ns = this;
	var nsc = new Namespace("foundation");
	var nse = new Namespace("advanced.events");
	var nsg = new Namespace("advanced.geom");
	var app = (new Namespace("advanced.application")).Application.getInstance();
	
	/** 
	* @class DOM の表示オブジェクトように高レベルAPIを提供します.
	* @augments EventDispatcher
	*/
	proto(function DisplayObject() {
		ex(nse.EventDispatcher);
		
		/**
		* DOM オブジェクトをを引数に、DisplayObject オブジェクトを作成します.
		* @param {Object} DOM
		* @memberOf DisplayObject
		*/
		init(function(domElement) {
			this.domElement = domElement;
			this.parent = null;
			this.alpha = 1;
		});
		
		/**
		* x 座標を返します.
		* @returns {Number}
		*/
		def(function getX() {
			return this.domElement.style.left.replace("px", "") || 0;
		});
		
		/**
		* x 座標を指定します.
		*/
		def(function setX(val) {
			this.domElement.style.marginLeft = val + "px";
		});
		
		/**
		* y 座標を返します.
		* @returns {Number}
		*/
		def(function getY() {
			return this.domElement.style.top.replace("px", "") || 0;
		});
		
		/**
		* y 座標を指定します.
		*/
		def(function setY(val) {
			this.domElement.style.top = val + "px";
		});
		
		/**
		* 幅を返します.
		* @returns {Number}
		*/
		def(function getWidth() {
			return this.domElement.offsetWidth;
		});
		
		/**
		* 幅を指定します.
		*/
		def(function setWidth(val) {
			this.domElement.style.width = val + "px";
		});
		
		/**
		* 高さを返します.
		* @returns {Number}
		*/
		def(function getHeight() {
			return this.domElement.offsetHeight;
		});
		
		/**
		* 高さを指定します.
		*/
		def(function setHeight(val) {
			this.domElement.style.height = val + "px";
		});
		
		/**
		* mouse x 座標を返します.
		* @returns {Number}
		*/
		def(function getMouseX() {
			return app.mouseX - this.getGlobalX();
		});
		
		/**
		* mouse y 座標を返します.
		* @returns {Number}
		*/
		def(function getMouseY() {
			return app.mouseX.mouseY - this.getGlobalY();	
		});
		
		/**
		* 表示領域左上隅からの x 座標を返します.
		* @returns {Number}
		*/
		def(function getGlobalX() {
			var tmpX = 0;
			tmpX = this.domElement.offsetLeft;
			var pa = this.domElement.offsetParent;
			while (pa) {
				tmpX += pa.offsetLeft;
				pa = pa.offsetParent;
			}
			return tmpX;
		});
		
		/**
		* 表示領域左上隅からの y 座標を返します.
		* @returns {Number}
		*/
		def(function getGlobalY() {
			var tmpY = 0;
			tmpY = this.domElement.offsetTop;
			var pa = this.domElement.offsetParent;
			while (pa) {
				tmpY += pa.offsetTop;
				pa = pa.offsetParent;
			}
			return tmpY;
		});
		
		/**
		* このオブジェクトの矩形領域を返します.
		* @returns {Rectangle}
		*/
		def(function getBounds(targetCoordinateSpace) {
			var targetXAtGlobal = targetCoordinateSpace.getGlobalX();
	 		var targetYAtGlobal = targetCoordinateSpace.getGlobalY();
	 		var thisXAtGlobal = this.getGlobalX();
	 		var thisYAtGlobal = this.getGlobalY();
	 		return new nsg.Rectangle(thisXAtGlobal - targetXAtGlobal, thisYAtGlobal  -targetXAtGlobal);
		});
		
		def(function getRect(targetCoordinateSpace) {
			return this.getBounds(targetCoordinateSpace);
		});
		
		/**
		* 引数に与えられたグローバル座標の、このDisplayObjectでの座標にして返します.
		* @param globalP {Point}
		* @returns {Point}
		*/
		def(function globalToLocal(globalP) {
			return new nsg.Point(this.x + globalP.x, this.y + globalP.y);
		});
		
		def(function paint() {
			var style = this.domElement.style;
			var ua = app.userAgent;
			if (ua.isIE()) { style.filter = "alpha(opacity=" + this.alpha * 100 + ")"; }
			else style.opacity = this.alpha.toString();
		});
		
		def(function rendering() {
			this.paint();
		});
		
		def(function removeFromSuperview() {
			this.domElement.parentNode.removeChild(this.de);
		});
	});
	
	
	/** 	
	* @class DisplayObjectがユーザー操作を受け付けるよう拡張します. 
	* @augments DisplayObject
	*/
	proto(function InteractiveObject() {
		ex(ns.DisplayObject);
		
		/**
		* @memberOf InteractiveObject
		*/
		init(function(domElement) {
			this.domElement = domElement;
			this.setEvents();
		});
		
		/**
		* マウスポインタがこの InteractiveObject オブジェクト上に重なった時, ハンドカーソルに変更するかどうか判別します.
		* @returns {Boolean}
		*/
		def(function getUseHandCursor() {
			return this.domElement.style.cursor == "pointer";
		});
		
		/**
		* マウスポインタがこの InteractiveObject オブジェクト上に重なった時, ハンドカーソルに変更するかどうか指定します.
		* @returns {Boolean}
		*/
		def(function setUseHandCursor(val) {
			if (val) {
				this.domElement.style.cursor = "pointer";
			}
			else {
				this.domElement.style.cursor = "default";
			}
		});
		
		/** @private */
		def(function setEvents() {
			var self = this;
			var g = new nsc.Utilitie();
			var isOvered = false;
			g.listen(this.domElement, nse.DOMMouseEvent.MOUSE_OVER, function(evt){
				if (isOvered == false) {
					isOvered = true;
					self.dispatchEvent(new nse.FLMouseEvent(nse.FLMouseEvent.ROLL_OVER, self));
				}
			});
			g.listen(this.domElement, nse.DOMMouseEvent.MOUSE_OUT, function(evt){
				if (isOvered) {
					var rect = new nsg.Rectangle(self.getGlobalX(), self.getGlobalY(), self.getWidth(), self.getHeight());
					if (isOvered) {
						isOvered = false;
						self.dispatchEvent(new nse.FLMouseEvent(nse.FLMouseEvent.ROLL_OUT, self, evt));
					}
				}
			});
			g.listen(this.domElement, nse.DOMMouseEvent.MOUSE_OVER, function(evt){
				var mOver = new nse.FLMouseEvent(nse.FLMouseEvent.MOUSE_OVER, self, evt);
				mOver.target = evt.target || evt.srcElement;
				self.dispatchEvent(mOver);
			});
			g.listen(this.domElement, nse.DOMMouseEvent.MOUSE_OUT, function(evt){
				var mOut = new nse.FLMouseEvent(nse.FLMouseEvent.MOUSE_OUT, self, evt);
				mOut.target = evt.target || evt.srcElement;
				self.dispatchEvent(mOut);
			});
			g.listen(this.domElement, nse.DOMMouseEvent.CLICK, function(evt){
				var click = new nse.FLMouseEvent(nse.FLMouseEvent.CLICK, self, evt);
				click.target = evt.target || evt.srcElement;
				self.dispatchEvent(click);
			});
			g.listen(this.domElement, nse.DOMMouseEvent.MOUSE_DOWN, function(evt){
				var down = new nse.FLMouseEvent(nse.FLMouseEvent.MOUSE_DOWN, self, evt);
				down.target = evt.target || evt.srcElement;
				self.dispatchEvent(down);
			});
			g.listen(this.domElement, nse.DOMMouseEvent.MOUSE_UP, function(evt){
				var up = new nse.FLMouseEvent(nse.FLMouseEvent.MOUSE_UP, self, evt);
				up.target = evt.target || evt.srcElement;
				self.dispatchEvent(up);
			});
		});

	});
});