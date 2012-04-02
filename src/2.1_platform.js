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
 * @fileOverview プラットフォームに関するオブジェクトが定義されています.
 */

new Namespace(namespace_lib_platform).use(function() {
	var ns = this;
	
	new Namespace(ns.nsName + ".browser").use(function() {
		/** 
		 * @class ユーザーエージェント周りの処理を受け持ちます.
		 */
		proto(function UserAgent() {
			/** @memberOf UserAgent */
			init(function() {
				this.ua = navigator.userAgent.toLowerCase();
			});
			/** InternetExplorer かどうか真偽値で返します @return {Boolean} */
			def(function isIE() {
				return this.ua.indexOf("msie") != -1;
			});
			/** InternetExplorer6 かどうか真偽値で返します @return {Boolean} */
			def(function isIE6() {
				return this.ua.indexOf("msie 6") != -1;
			});
			/** InternetExplorer7 かどうか真偽値で返します @return {Boolean} */
			def(function isIE7() {
				return this.ua.indexOf("msie 7") != -1;
			});
			/** InternetExplorer8 かどうか真偽値で返します @return {Boolean} */
			def(function isIE8() {
				return this.ua.indexOf("msie 8") != -1;
			});
			/** FireFox かどうか真偽値で返します @return {Boolean} */
			def(function isFireFox() {
				return this.ua.indexOf("firefox") != -1;
			});
			/** Safari かどうか真偽値で返します @return {Boolean} */
			def(function isSaferi() {
				return this.ua.indexOf("safari") == -1 || this.isChrome() ? false : true;
			});
			/** Google Chrome かどうか真偽値で返します @return {Boolean} */
			def(function isChrome() {
				return this.ua.indexOf("chrome") != -1;
			});
			/** Opera かどうか真偽値で返します @return {Boolean} */
			def(function isOpera() {
				return this.ua.indexOf("chrome") != -1;
			});
			/** モバイルデバイス上のブラウザかどうか真偽値で返します(現在は iPhone, iPodTouch, Android のみ真になります) @return {Boolean} */
			def(function isMobile() {
				return (this.isiPhone() || this.isiPodTouch() || this.isAndroid());
			});
			/** iPhoneのブラウザ かどうか真偽値で返します @return {Boolean} */
			def(function isiPhone() {
				return this.ua.indexOf("iphone") != -1;
			});
			/** iPadのブラウザかどうか真偽値で返します @return {Boolean} */
			def(function isiPad() {
				return this.ua.indexOf("ipad") != -1;
			});
			/** iPodTouch かどうか真偽値で返します @return {Boolean} */
			def(function isiPodTouch() {
				return this.ua.indexOf("ipod") != -1;
			});
			/** Android かどうか真偽値で返します @return {Boolean} */
			def(function isAndroid() {
				return this.ua.indexOf("android") != -1;
			});
		});
	});
});