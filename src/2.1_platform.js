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

new Namespace(namespace_lib_platform).use(function() {
	var ns = this;
	
	new Namespace(ns.nsName + ".browser").use(function() {
		/** 
			 * creating a UserAgent
		 * @class ユーザーエージェント
		 */
		proto(function UserAgent() {
			init(function() {
				this.ua = navigator.userAgent.toLowerCase();
			});

			def(function isIE() {
				return this.ua.indexOf("msie") != -1;
			});

			def(function isIE6() {
				return this.ua.indexOf("msie 6") != -1;
			});

			def(function isIE7() {
				return this.ua.indexOf("msie 7") != -1;
			});

			def(function isIE8() {
				return this.ua.indexOf("msie 8") != -1;
			});

			def(function isFireFox() {
				return this.ua.indexOf("firefox") != -1;
			});

			def(function isSaferi() {
				return this.ua.indexOf("safari") == -1 || this.isChrome() ? false : true;
			});

			def(function isChrome() {
				return this.ua.indexOf("chrome") != -1;
			});

			def(function isOpera() {
				return this.ua.indexOf("chrome") != -1;
			});

			def(function isMobile() {
				return (this.isiPhone() || this.isiPodTouch() || this.isAndroid());
			});

			def(function isiPhone() {
				return this.ua.indexOf("iphone") != -1;
			});

			def(function isiPad() {
				return this.ua.indexOf("ipad") != -1;
			});

			def(function isiPodTouch() {
				return this.ua.indexOf("ipod") != -1;
			});

			def(function isAndroid() {
				return this.ua.indexOf("android") != -1;
			});
		});
	});
});