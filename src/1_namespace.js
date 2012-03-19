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
if (!global.debug || !global.console) {
	console = {};
	console.log = 
	console.error = 
	console.assert =
	console.count = 
	console.debug = 
	console.info = 
	console.trace = 
	console.warn = 
	function(){};
}
var FunctionPrototype = function() {
	var self = this;
	// util
	function getMethodName(method) {
		var name = method.name;
		if (name == undefined) {
			name = /function\s*(.*)\s*\(/mgi.exec(method)[1];
			if (name == null) return;
		}
		return name;
	}
	this.getMethodName = getMethodName;
	
	// hierarchie util
	function wrap(key, method) {
		var wrapper = method;
		// use by $super() method
		wrapper.superMethod = self.substance.prototype[key];
		return wrapper;
	};
	function $super() {
		return arguments.callee.caller.superMethod.apply(this, arguments);
	};
	
	/**
	* object generation
	**/
	this.gen = function() {
		var obj = new this();
		if (obj.initialize != undefined) {
			obj.initialize.apply(obj, arguments);
		}
		return obj;
	};
	
	/**
	* returning singleton object
	**/
	this.getInstance = function() {
		var instance = this.instance;
		if (!instance) {
			instance = this.instance = new this();
			if (instance.initialize != undefined) {
				instance.initialize.apply(instance, arguments)
			}
		}
		return this.instance;
	}
	
	// define method to initialize
	this.init = function(initialize) {
		self.substance.prototype.initialize = wrap("initialize", initialize);
	};
	this.ex = function(obj) {
		var proto = obj.gen();
		self.substance.superClass = obj.prototype;
		self.substance.prototype = proto;
		self.substance.prototype.$super = $super;
	};
	this.include = function(module, overwrite) {
		for (var p in module) {
			if (overwrite || this[p] == undefined) {
				this[p] = module[p];
			}
		}
	};
	this.getter = function (name, func) {
		var p = self.substance.prototype;
		if ("__defineGetter__" in p) {
			p.__defineGetter__(name, func);
		}
	}
	this.setter = function (name, func) {
		var p = self.substance.prototype;
		if ("__defineSetter__" in p) {
			p.__defineSetter__(name, func);
		}
	}
	
	// define method to method definition
	this.def = function(method){
		var name = getMethodName(method);
		self.substance.prototype[name] = wrap(name, method);
	};
	this.defInObj = function(method) {
		var name = getMethodName(method);
		this[name] = method;
	}
}
FunctionPrototype = new FunctionPrototype();

var InternalNamespacePrototype = function() {
	this.nsName = "";
	var self = this;
	
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
	
	this.proto = function(namedFunc) {
		var tmpSelf = self;
		if (this instanceof Namespace) {
			tmpSelf = this;
		}
		var name = FunctionPrototype.getMethodName(namedFunc);
		if (tmpSelf[name] != undefined) alert("Warning: " + tmpSelf.nsName + "'s " + name + " was overwritten.");
		if (!global.debug)
			tmpSelf[name] = function() {};
		else
			tmpSelf[name] = eval("(function " + name + " () {})");
		
		if (tmpSelf[name] == undefined) tmpSelf[name] = new Function();
		var proto = tmpSelf[name];
		proto.gen = FunctionPrototype.gen;
		proto.def = FunctionPrototype.defInObj;
		proto.prototype.include = FunctionPrototype.include;
		proto.prototype.$class = proto;
		
		// fake dynamic scope
		var old$$ = global.$$;
		var oldInit = global.init;
		var oldEx = global.ex;
		var oldMeth = global.def;
		var oldGetter = global.getter;
		var oldSetter = global.setter;
		FunctionPrototype.substance = proto;
		
		global.$$ = proto;
		global.init = namedFunc.init = FunctionPrototype.init;
		global.ex = namedFunc.ex = FunctionPrototype.ex;
		global.def = namedFunc.def = FunctionPrototype.def;
		global.getter = FunctionPrototype.getter;
		global.setter = FunctionPrototype.setter;
		namedFunc.call(namedFunc);

		global.$$ = old$$;
		global.init = oldInit;
		global.ex = oldEx;
		global.def = oldMeth;
		global.getter = oldGetter;
		global.setter = oldSetter;
		
		proto.prototype.proto = proto;
	};
	
	this.singleton = function(namedFunc) {
		var tmpSelf = self;
		if (this instanceof Namespace) {
			tmpSelf = this;
		}
		var name = FunctionPrototype.getMethodName(namedFunc);
		if (tmpSelf[name] != undefined) alert("Warning: " + tmpSelf.nsName + "'s " + name + " was overwritten.");
		
		tmpSelf[name] = eval("(function " + name + " () {})");
		if (tmpSelf[name] == undefined) tmpSelf[name] = new Function();
		var proto = tmpSelf[name];
		proto.getInstance = FunctionPrototype.getInstance;
		proto.def = FunctionPrototype.defInObj;
		proto.prototype.include = FunctionPrototype.include;
		proto.prototype.$class = proto;
		
		// fake dynamic scope
		var old$ = global.$;
		var old$$ = global.$$;
		var oldInit = global.init;
		var oldEx = global.ex;
		var oldMeth = global.def;
		var oldGetter = global.getter;
		var oldSetter = global.setter;
		FunctionPrototype.substance = proto;
		
		global.$ = namedFunc;
		global.$$ = proto;
		global.init = namedFunc.init = FunctionPrototype.init;
		global.ex = namedFunc.ex = FunctionPrototype.ex;
		global.def = namedFunc.def = FunctionPrototype.def;
		global.getter = FunctionPrototype.getter;
		global.setter = FunctionPrototype.setter;
		namedFunc.call(namedFunc);

		global.$ = old$; 
		global.$$ = old$$;
		global.init = oldInit;
		global.ex = oldEx;
		global.def = oldMeth;
		global.getter = oldGetter;
		global.setter = oldSetter;
		
		proto.prototype.proto = proto;
	};
}

var internalNamespacePrototype = new InternalNamespacePrototype();
Namespace = function(str) {
	var ns = str.split('.');
	
	var here = global;
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
			here[ns[i]] = new Namespace(ns[i]);
		}
		if (i > 0) name += ".";
		name += ns[i];
		here[ns[i]].nsName = name;
		/* else {
			// 他のライブラリ等ですでに使われてしまっている場合は mix
		}*/
		here = here[ns[i]];
	}
	return here;
}
Namespace.prototype = internalNamespacePrototype;

new Namespace(namespace_lib_core).use(function () {
	var ns = this;
	
	/** 
	 * creating a Performer
	 * @class 
	 */
	 proto(function Performer() {
	 	init(function(target, callback, args) {
	 		this.target = target;
	 		this.callback = callback;
	 		this.args = args;
	 	});
	 	
	 	def(function perform() {
	 		this.callback.apply(this.target, arguments);
	 	})
	 });
	
	/** 
	 * creating a Utilitie 
	 * @class 実行環境ごとの差異吸収がメインのしごと
	 */
	proto(function Utilitie() {
		def(function listen(target, type, func) {
			if (target.addEventListener)
				target.addEventListener(type, function (e) {
					func.call(this, e);
				}, false);
			else if (target.attachEvent)
				target.attachEvent(type, function (e) {
					func.call(this, e);
				});
		});
		
		def(function unlisten(target, type, func) {
			if (target.removeEventListener)
				target.removeEventListener(type, func);
			else if (target.attachEvent)
				target.detachEvent(type, func);
		})		
	});
	
	/**
	* @archetype Main
	* 
	**/
	singleton(function Main() {
		// To initialize when the Main.gen(params) called.
		init(function() {
				var self = this;
				var util = ns.Utilitie.gen();
				var isIE = navigator.userAgent.toLowerCase().indexOf("msie") != -1;
				
				util.listen(global, isIE ? "onload" : "load", function () {
						util.unlisten(global, isIE ? "onload" : "load", arguments.callee);
						if (self.runner) self.runner.call(global);
				});
		})
		
		// main {replace the description here}.
		def(function main(runner) {
			this.runner = runner;
		})
	})
	
});