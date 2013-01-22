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

Namespace.require(NS_EVENTS);

new Namespace(NS_APP).use(function() {	
	var ns = this;
		
	 /** 
	 * @class Application
	 * @augments EventDispatcher
	 */
	singleton(function Application() {
		var nse = new Namespace(NS_EVENTS);
		ex(nse.EventDispatcher);
		
		init(function() {
			var self = this;
			/** 
			* 表示領域内でのマウスポインタの x 位置
			* @memberOf Application.prototype
			*/
			this.mouseX = 0;
			/** 
			* 表示領域内でのマウスポインタの y 位置
			* @memberOf Application.prototype 
			*/
			this.mouseY = 0;
			/** @memberOf Application.prototype */
			this.userAgent = new (new Namespace(NS_PLATFORM)).UserAgent();
			
			var nscore = (new Namespace(NS_CORE));
			var util = new nscore.Utilitie();
			var isIE = this.userAgent.isIE();
			var app = this;
			this.canTrackMouse = false;
			util.listen(document, isIE ? "onmousemove" : "mousemove", function(mouseMove) {
				if (!isIE) {
					app.mouseX = mouseMove.clientX;
					app.mouseY = mouseMove.clientY;
					if (document.body)	{ this.mouseY +=  document.body.scrollTop;}
				} else {
					app.mouseX = mouseMove.clientX;
					app.mouseY = mouseMove.clientY + document.documentElement.scrollTop;
				}
				if (app.canTrackMouse == false) app.canTrackMouse = true;
			});
			
		});
	});

});