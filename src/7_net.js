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
* @fileOverview ネットワークに関係するオブジェクトが定義されています.
*/
new Namespace(namespace_lib_net).use(function () {
	var ns = this;
	
	/** 
	* @class URL
	*/
	proto(function URL() {
		/**
		* 文字列からURLオブジェクトを作成します.
		* @param url {String}
		* @memberOf URL
		*/
		init(function(url) {
			this.url = url;
			this.scheme = 
			this.port = 
			this.user = 
			this.pass = 
			this.path = 
			this.query = 
			this.fragment = "";
			this.generate();
		});
		
		/** 
		* @private
		*/
		def(function generate() {
			var r = this.reg.exec(this.url);
			if (r) {
				var value = "";
				for (var f in this.fields) {
					value = r[this.fields[f]];
					if (value) {
						this[f] = value;
					}
				}
			}
		});
		
		$$.reg = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?([^#]*)/;
		$$.fields = {
				"scheme": 2,
				"host": 6,
				"port": 7,
				"user": 4,
				"pass": 5,
				"path": 8,
				"query": 9,
				"fragment": 10
		};
		
	});
	
	/** 
	* @class URL request
	*/
	proto(function URLRequest() {
		/**
		* @param urlString {String}
		* @memberOf URLRequest
		*/
		init(function (urlString) {
			this.url = urlString;
			this.httpMethod = "GET";
			this.httpHeader = {};
			this.httpBody = null;
			this.httpHeader.contentType = "application/x-www-form-urlencoded;charset=UTF-8";
		});
	});
	
	
	/** 
	* @class 非同期でデータを取得します.
	* @augments EventDispatcher
	*/
	proto(function URLLoader() {
		var nse = new Namespace(namespace_lib_events);
		
		ex(nse.EventDispatcher);
		
		/**
		* @memberOf URLLoader
		*/
		init(function () {
			this.currentXHR = null;
			this.data = null;
			
			var self =  this;
			this.readyStateCallback = function(e) {
				if (self.currentXHR.readyState == ns.URLLoader.DONE) {
					self.data = self.currentXHR.responseText;
					self.dispatchEvent(nse.FLEvent.gen(nse.FLEvent.COMPLETE, self, e || null));
				}
			}
		});
		
		/**
		* 通信を開始します.
		* @param req {URLRequest}
		*/
		def(function load(req) {
			var xhr = this.currentXHR = this.generateXHR();
			xhr.onreadystatechange = this.readyStateCallback;
			xhr.open(req.httpMethod, req.url, true, null /* password */);
			xhr.setRequestHeader("Content-type", req.httpHeader.contentType);
			xhr.send(req.httpBody);
		});
		
		def(function generateXHR() {
			var xhr;
			if (global.XMLHttpRequest != undefined) {
				xhr = new XMLHttpRequest();
			} else if (global.ActiveXObject){
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
			return xhr;
		});
		
		$$.UNSET = 0;
		$$.OPENED = 1;
		$$.HEADERS_RECEIVED = 2;
		$$.LOADING = 3;
		$$.DONE = 4;
	});
	
});