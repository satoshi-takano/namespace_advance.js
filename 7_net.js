new Namespace(namespace_lib_net).using(function () {
	var ns = this;
	
	/** 
	* creating a URL
	* @class 
	*/
	clas(function URL() {
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
	* creating a URLRequest
	* @class flash の URLRequest
	*/
	clas(function URLRequest() {
		init(function (urlString) {
			this.url = urlString;
			this.httpMethod = "GET";
			this.httpHeader = {};
			this.httpBody = null;
			this.httpHeader.contentType = "application/x-www-form-urlencoded;charset=UTF-8";
		});
	});
	
	
	/** 
	* creating a URLLoader
	* @class flash の URLLoader
	*/
	clas(function URLLoader() {
		var nse = new Namespace(namespace_lib_events);
		
		ex(nse.EventDispatcher);
		
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
		
		def(function load(req) {
			var xhr = this.currentXHR = this.generateXHR();
			xhr.onreadystatechange = this.readyStateCallback;
			xhr.open(req.httpMethod, req.url, true, null /* password */);
			xhr.setRequestHeader("Content-type", req.httpHeader.contentType);
			xhr.send(req.httpBody);
		});
		
		def(function generateXHR() {
			var xhr;
			if (window.XMLHttpRequest != undefined) {
				xhr = new XMLHttpRequest();
			} else if (window.ActiveXObject){
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