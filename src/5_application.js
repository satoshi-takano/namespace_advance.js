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


new Namespace(namespace_lib_app).use(function() {
	var ns = this;
		
	 /** 
	 * @class Application
	 * @augments EventDispatcher
	 */
	singleton(function Application() {
		var nse = new Namespace(namespace_lib_events);
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
			this.userAgent = new Namespace(namespace_lib_platform).browser.UserAgent.gen();
			
			var nscore = (new Namespace(namespace_lib_core));
			var util = nscore.Utilitie.gen();
			var isIE = this.userAgent.isIE();
			util.listen(document, isIE ? "onmousemove" : "mousemove", function(mouseMove) {
				if (!isIE) {
					this.mouseX = mouseMove.clientX;
					this.mouseY = mouseMove.clientY;
					if (document.body)	{ this.mouseY +=  document.body.scrollTop;}
				} else {
					this.mouseX = mouseMove.clientX;
					this.mouseY = mouseMove.clientY + document.documentElement.scrollTop;
				}
			});
			
		});
	});

});