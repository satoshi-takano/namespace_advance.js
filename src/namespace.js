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
* @fileOverview Namespace.js
* @version 0.7.0
*/

if (this['global'] == undefined)
	this['global'] = this;

/**
* @class 
* @name Namespace
* @param {String} str Pass the string expressed namespace. e.g. "jp.example.hoge"
* @description Create a namespace.
*/
Namespace = function(str, here) {
	var ns = str.split('.');
	
	var here = here || global;
	if (ns.length == 1) {
		if (here[str] != undefined)
			return here[str];
		
		here[str] = this;
		this.nsName = str;
		return this;
	}
	
	var name = "";
	for (var i = 0, l = ns.length, ll = l-1; i < l; i++) {
		if (typeof(here[ns[i]]) == "undefined") {
			here[ns[i]] = new Namespace(ns[i], here);
		}
		if (i > 0) name += ".";
		name += ns[i];
		here[ns[i]].nsName = name;
		here = here[ns[i]];
	}
	return here;
}

/**
* Relative or absolute path of root directory contains JavaScript files.
* @memberof Namespace
* @member {String} jsPath
* @default "./js"
**/
Namespace.jsPath = "./js";
Namespace.prototype = new (function() {
	var FunctionPrototype = function() {
		var self = this;
		
		function getMethodName(method) {
			var name = method.name;
			if (name == undefined) {
				name = /function\s*(.*)\s*\(/mgi.exec(method)[1];
				if (name == null) return;
			}
			return name;
		}
		this.getMethodName = getMethodName;

		function wrap(key, method) {
			var wrapper = method;
			// use by $super() method
			wrapper.superMethod = self.substance.prototype[key];
			wrapper.owner = self.substance;
			return wrapper;
		};
		function $super() {
			return arguments.callee.caller.superMethod.apply(this, arguments);
		};

		/**
		* クラスからシングルトンインスタンスを得ます.<br/>
		* 引数に渡したオブジェクトは,クラスのコンストラクタにそのまま引き渡されます.
		**/
		this.getInstance = function() {
			var instance = this.instance;
			if (!instance) {
				instance = this.instance = new this();
			}
			return this.instance;
		}

		/**
		* Define constructor.
		* warning: You can call this function only when you're in Namespace#proto context.
		* @method init
		* @memberOf Namespace#
		* @param {function} initialize A function called when the instance is created.
		**/
		this.init = function(initialize) {
			self.substance.prototype.initialize = wrap("initialize", initialize);
		};

		/**
		* Extends the an argument. </br>
		* warning: You can call this function only when you're in Namespace#proto context.
		* @method ex
		* @memberof Namespace#
		* @param {function} obj Pass the function that will called 'new' and used Object#prototype.
		**/
		this.ex = function(obj) {
			// if (obj == undefined) console.log(arguments.callee.caller)
			var tmpInit = self.substance.prototype.initialize;
			var proto = new obj({__callInitialize__:false});

			obj.initialize = tmpInit;
			self.substance.superClass = obj.prototype;

			self.substance.prototype = proto;
			self.substance.prototype.$class = self.substance;
			self.substance.prototype.$super = $super;
		};

		/**
		* Mix in.</br>
		* warning: You can call this function only when you're in Namespace#proto context.
		* @method include
		* @memberOf Namespace#
		* @param {object} module Module.
		* @param {boolean} overwrite If passed true, this function will override the module that already defined.
		**/
		this.include = function(module, overwrite) {
			for (var p in module) {
				if (overwrite || this[p] == undefined) {
					this[p] = module[p];
				}
			}
		};

		/**
		* Define the getter.
		* warning: You can call this function only when you're in Namespace#proto context.<br/>
		*		   If user's environment doesn't supports __defineGetter__ function, this function won't do anything.
		* @method getter
		* @memberOf Namespace#
		* @param {string} name property name.
		* @param {function} func The function called when client read the property.
		**/
		this.getter = function (name, func) {
			var p = self.substance.prototype;

			var fullname = "get" + name;
			self.substance.prototype[fullname] = wrap(fullname, func);

			if ("__defineGetter__" in p) {
				p.__defineGetter__(name, func);
			}
		}

        this.attrReader = function() {
            var attributes = arguments;
            for (var i = 0, l = attributes.length; i < l; i++) {
                var p = attributes[i];
                (function (attr) {
                    this.getter(attr, function() {return this["_" + attr];})
                })(p)
            }
        }

        this.attrWriter = function() {
            var attributes = arguments;            
            for (var i = 0, l = attributes.length; i < l; i++) {
                var p = attributes[i];
                (function (attr) {
                    this.setter(attr, function(val) {this["_" + attr] = val;})
                })(p)
            }
        }

        this.attrAccessor = function() {
            var attributes = arguments;            
            for (var i = 0, l = attributes.length; i < l; i++) {
                var p = attributes[i];
                (function (attr) {
                    this.getter(attr, function() {return this["_" + attr];})
                    this.setter(attr, function(val) {this["_" + attr] = val;})
                })(p)
            }
        }
        
		/**
		* Define the setter
		* warning: You can call this function only when you're in Namespace#proto context.<br/>
		*		   If user's environment doesn't supports __defineSetter__ function, this function won't do anything.
		* @method setter
		* @memberOf Namespace#
		* @param {string} name property name.
		* @param {function} func The function called when client set the property.
		**/
		this.setter = function (name, func) {
			var p = self.substance.prototype;

			var fullname = "set" + name;
			self.substance.prototype[fullname] = wrap(fullname, func);

			if ("__defineSetter__" in p) {
				p.__defineSetter__(name, func);
			}
		}

		/**
		* Define the method.
		* @method def
		* @memberOf Namespace#
		* @param method {function} method Named function.
		**/
		this.def = function(method){
			var name = getMethodName(method);
			self.substance.prototype[name] = wrap(name, method);
		};
		this.defInObj = function(method) {
			var name = getMethodName(method);
			this[name] = method;
		}
	}
	functionPrototype = new FunctionPrototype();
	
	this.nsName = "";
	this._loading = false;
	this._loaded = false;
	
	var self = this;
	
	/**
	* Use the namespace.</br>
	* @method use
	* @memberOf Namespace#
	* @param {fucntion} func
	*/
	this.use = function(func) {
		self = this;
		var oldDef = global.proto;
		var oldSingleton = global.singleton;
		global.proto = this.proto;
		global.singleton = this.singleton;
		func.call(this);
		global.proto = oldDef;
		global.singleton = oldSingleton;
	};
	
	/**
	* Define the prototype.</br>
	* Prototype that defined using the proto function will be able to create using the new sentence.
	* @method proto
	* @memberOf Namespace#
	* @param {function} namedFunc Named function.
	*/
	this.proto = function(namedFunc) {
		var tmpSelf = self;
		if (this instanceof Namespace) {
			tmpSelf = this;
		}
		// get the name of function
		var name = functionPrototype.getMethodName(namedFunc);

		if (tmpSelf[name] != undefined) console.warn("Warning: " + tmpSelf.nsName + "'s " + name + " was overwritten.");
		tmpSelf[name] = eval("(function " + name + " () {\
				var internal = arguments[0];\
				var callInitialize = internal == undefined ? true : internal.__callInitialize__ ;\
				if (callInitialize == undefined) callInitialize = true;\
				if (callInitialize && this.initialize) {\
					this.initialize.apply(this, arguments);\
				}\
			})");
		if (tmpSelf[name] == undefined) tmpSelf[name] = new Function();
		
		var proto = tmpSelf[name];
		proto.def = functionPrototype.defInObj;
		proto.prototype.include = functionPrototype.include;
		proto.prototype.name = name;
		proto.prototype.$class = proto;
		
		// fake dynamic scope
		var old$$ = global.$$;
		var oldInit = global.init;
		var oldEx = global.ex;
		var oldMeth = global.def;
		var oldGetter = global.getter;
		var oldSetter = global.setter;
        var oldReader = global.attrReader;
        var oldWriter = global.attrWriter;
        var oldAccessor = global.attrAccessor;
		functionPrototype.substance = proto;
		
		// set temporary global methods
		global.$$ = proto;
		global.init = namedFunc.init = functionPrototype.init;
		global.ex = namedFunc.ex = functionPrototype.ex;
		global.def = namedFunc.def = functionPrototype.def;
		global.getter = functionPrototype.getter;
		global.setter = functionPrototype.setter;
        global.attrReader = functionPrototype.attrReader;
        global.attrWriter = functionPrototype.attrWriter;
        global.attrAccessor = functionPrototype.attrAccessor;        
		
		// build the class
		namedFunc.call();

		// restore global methods
		global.$$ = old$$;
		global.init = oldInit;
		global.ex = oldEx;
		global.def = oldMeth;
		global.getter = oldGetter;
		global.setter = oldSetter;
        global.attrReader = oldReader;
        global.attrWriter = oldWriter;
        global.attrAccessor = oldAccessor;
		
		proto.prototype.proto = proto;
	};
	
	/**
	* Define the singleton prototype.</br>
	* Prototype that defined using singleton function will be able to create using Prototype#getInstance.
	* @method singleton
	* @memberOf Namespace#
	* @param {function} namedFunc Named function.
	*/
	this.singleton = function(namedFunc) {
		var tmpSelf = self;
		if (this instanceof Namespace) {
			tmpSelf = this;
		}
		var name = functionPrototype.getMethodName(namedFunc);
		if (tmpSelf[name] != undefined) console.warn("Warning: " + tmpSelf.nsName + "'s " + name + " was overwritten.");

		tmpSelf[name] = eval("(function " + name + " () {\
				var internal = arguments[0];\
				var callInitialize = internal == undefined ? true : internal.__callInitialize__ ;\
				if (callInitialize == undefined) callInitialize = true;\
				if (callInitialize && this.initialize) {\
					this.initialize.apply(this, arguments);\
				}\
			})");
		if (tmpSelf[name] == undefined) tmpSelf[name] = new Function();

		var proto = tmpSelf[name];
		proto.getInstance = functionPrototype.getInstance;
		proto.def = functionPrototype.defInObj;
		proto.prototype.include = functionPrototype.include;
		proto.prototype.name = name;
		proto.prototype.$class = proto;

        // fake dynamic scope
		var old$$ = global.$$;
		var oldInit = global.init;
		var oldEx = global.ex;
		var oldMeth = global.def;
		var oldGetter = global.getter;
		var oldSetter = global.setter;
        var oldReader = global.attrReader;
        var oldWriter = global.attrWriter;
        var oldAccessor = global.attrAccessor;
		functionPrototype.substance = proto;
		
		// set temporary global methods
		global.$$ = proto;
		global.init = namedFunc.init = functionPrototype.init;
		global.ex = namedFunc.ex = functionPrototype.ex;
		global.def = namedFunc.def = functionPrototype.def;
		global.getter = functionPrototype.getter;
		global.setter = functionPrototype.setter;
        global.attrReader = functionPrototype.attrReader;
        global.attrWriter = functionPrototype.attrWriter;
        global.attrAccessor = functionPrototype.attrAccessor;        
		
		// build the class
		namedFunc.call();

		// restore global methods
		global.$$ = old$$;
		global.init = oldInit;
		global.ex = oldEx;
		global.def = oldMeth;
		global.getter = oldGetter;
		global.setter = oldSetter;
        global.attrReader = oldReader;
        global.attrWriter = oldWriter;
        global.attrAccessor = oldAccessor;

		proto.prototype.proto = proto;
	};
})();

/**
* Load dependent .js files asynchronous and recursively.
* @method require
* @memberOf Namespace#
* @param {array} packages The array contains dependent namespace's names.
* @param {function} callback Function called when loaded all dependent .js files.
**/
Namespace.prototype.require = function(packages, callback) {
	var _this = this;
	// 依存しているファイルの数.
	this._numToReadPackages = packages.length;
	var info = {
		clientNamespace: this,
		packages: packages,
		
		childCompletion: function(child) {
			if (!child._numToReadPackages) {
				// 依存先で依存しているファイルをすべて読み込み終えたら次を読み込み始める
				_this._numToReadPackages--;
				// まだ読み込み終えてないのがあったら読む
				if (_this.info.packages.length) {
					var next = _this.info.packages.splice(0, 1)[0];
					addTag(next);
				} else {
				// すべて読み込み終えたらコールバックを呼びつつ、自分の完了を親の childCompletion を呼び出してしらせる
					if (!_this._imported) {
						callback.call(_this);
						_this._imported = true;
					}
					if (_this.parentInfo)
						_this.parentInfo.childCompletion(_this);
				}
			}
		}
	};
	
	this.info = info;
	
	var $package = packages.splice(0, 1)[0];

	addTag($package);
	
	function addTag($package) {
		var ns = new Namespace($package);
		ns.parentInfo = info;

		// すでに読み込み済み or 読込中の場合は捨てる
		if (ns._loading || ns._loaded) {
			_this.info.childCompletion(ns);
			return;
		}
		
		// script tag 作って読み込み
		ns._loading = true;
		var jsURL = Namespace.jsPath + "/" + ns.nsName.replace(/\./g, "/") + ".js";
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = jsURL;
		script.onload = function() {
			ns._loading = false;
			ns._loaded = true;
			_this.info.childCompletion(ns);
		}
		script.onreadystatechange = function(e) {if(e.readyState=="loaded"||e.readyState=="complete") script.onload();}
		document.body.appendChild(script);
	}
}
