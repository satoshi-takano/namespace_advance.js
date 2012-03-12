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
	/**
	* @archetype Canvas
	* 
	**/
	proto(function Canvas() {
		ex(new Namespace(namespace_lib_display).DisplayObject);
		
		// To initialize when the Canvas.gen(params) called.
		init(function(elem) {
			this.parent(elem);
			this.context = elem.getContext("2d");
		})
		
		// beginFill {replace the description here}.
		def(function beginFill(color, alpha) {
			var r = color >> 16;
			var g = color >> 8 & 0xff;
			var b = color & 0xff;
			this.context.fillStyle = "rgba(" + r + "," + g + "," + b + "," + alpha +")";
		})
		
		// drawCircle {replace the description here}.
		def(function drawCircle(x, y, r) {
			var c = this.context;
			c.beginPath();
			c.arc(x, y, r, 0, 2 * Math.PI, false);
			c.closePath();
			c.fill();
		})
		
		// clearRect {replace the description here}.
		def(function clearRect(x, y, w, h) {
			this.context.clearRect(0, 0, 900, 300);
		})
		
		// moveTo {replace the description here}.
		def(function moveTo(x, y) {
			this.context.moveTo(x, y);
		})
		
		// lineTo {replace the description here}.
		def(function lineTo(x, y) {
			this.context.lineTo(x, y);
		})
		
		// curveTo {replace the description here}.
		def(function curveTo(cpx, cpy, ax, ay) {
			this.context.quadraticCurveTo(cpx, cpy, ax, ay);
		})
		
		// bezierCurveTo {replace the description here}.
		def(function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
			this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
		})
		
		// fillRect {replace the description here}.
		def(function fillRect(x, y, w, h) {
			this.context.fillRect(x, y, w, h);
		})
		
		// endFill {replace the description here}.
		def(function endFill() {

			this.context.fill();
		})
		
		
		// draw {replace the description here}.
		def(function debug() {
		})
		
	})
	
})