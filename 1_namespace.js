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
		// 親クラスの同名メソッドを保持
		wrapper.superMethod = self.substance.prototype[key];
		return wrapper;
	};
	function parent() {
		return arguments.callee.caller.superMethod.apply(this, arguments);
	};
	
	// object generation
	this.gen = function() {
		var obj = new this();
		if (obj.initialize != undefined) {
			obj.initialize.apply(obj, arguments);
		}
		return obj;
	};
	
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
	
	// class definition
	this.init = function(initialize) {
		if (self.substance.prototype.$super)
			self.substance.prototype.$super["initialize"] = self.substance.prototype.$super.prototype.initialize;
		self.substance.prototype.initialize = wrap("initialize", initialize);
	};
	this.ex = function(obj) {
		var proto = obj.gen();
		self.substance.superClass = obj.prototype;
		self.substance.prototype = proto;
		self.substance.prototype.$super = obj;
		self.substance.prototype.parent = parent;
	};
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
	
	this.using = function(func) {
		self = this;
		var oldDef = window.clas;
		var oldSingleton = window.singleton;
		window.clas = this.clas;
		window.singleton = this.singleton;
		func.call(this);
		window.clas = oldDef;
		window.singleton = oldSingleton;
	};
	
	this.clas = function(namedFunc) {
		var tmpSelf = self;
		if (this instanceof Namespace) {
			tmpSelf = this;
		}
		var name = FunctionPrototype.getMethodName(namedFunc);
		if (tmpSelf[name] != undefined) alert("Warning: " + tmpSelf.nsName + "'s " + name + " was overwritten.");
		
		tmpSelf[name] = eval("(function " + name + " () {})");
		if (tmpSelf[name] == undefined) tmpSelf[name] = new Function();
		var proto = tmpSelf[name];
		proto.gen = FunctionPrototype.gen;
		proto.def = FunctionPrototype.defInObj;
		
		// fake dynamic scope
		var old$ = window.$;
		var old$$ = window.$$;
		var oldInit = window.init;
		var oldEx = window.ex;
		var oldMeth = window.def;
		FunctionPrototype.substance = proto;
		
		window.$ = namedFunc;
		window.$$ = proto;
		window.init = namedFunc.init = FunctionPrototype.init;
		window.ex = namedFunc.ex = FunctionPrototype.ex;
		window.def = namedFunc.def = FunctionPrototype.def;
		namedFunc.call(namedFunc);

		window.$ = old$; 
		window.$$ = old$$;
		window.init = oldInit;
		window.ex = oldEx;
		window.def = oldMeth;
		
		proto.prototype.clas = proto;
	};
	
	this.singleton = function(namedFunc) {
		var tmpSelf = self;
		if (this instanceof Namespace) {
			tmpSelf = this;
		}

		var name = namedFunc.name;
		if (name == undefined) {
			name = /function\s*(.*)\s*\(/mgi.exec(namedFunc)[1];
			if (name == null) return;
		}
		if (tmpSelf[name] != undefined) alert("Warning: " + tmpSelf.nsName + "'s " + name + " was overwritten.");
		
		tmpSelf[name] = eval("(function " + name + " () {})");
		if (tmpSelf[name] == undefined) tmpSelf[name] = new Function();
		var proto = tmpSelf[name];
		proto.getInstance = FunctionPrototype.getInstance;
		proto.prototype.cls = proto;

		
		var oldSub = window[name];
		var oldInit = window.init;
		var oldEx = window.ex;
		var oldMeth = window.def;
		var oldClsVar = window.clsVar;
		var oldClsMeth = window.clsMethod;
		FunctionPrototype.substance = tmpSelf[name];
		window.init = namedFunc.init = FunctionPrototype.init;
		window.ex = namedFunc.ex = FunctionPrototype.ex;
		window.def = namedFunc.def = FunctionPrototype.def;
		window.clsVar = namedFunc.clsVar = FunctionPrototype.clsVar;
		window.clsMethod = namedFunc.clsMethod = FunctionPrototype.clsMethod;
		
		// 擬似的に動的スコープ
		var stack = window.$;
		window.$ = namedFunc; 
		namedFunc.call(namedFunc);
		// 復元
		window.$ = stack; 
		window[name] = oldSub;
		window.init = oldInit;
		window.ex = oldEx;
		window.def = oldMeth;
		window.clsVar = oldClsVar;
		window.clsMeth = window.clsMethod;
	};
}

var internalNamespacePrototype = new InternalNamespacePrototype();
Namespace = function(str) {
	var ns = str.split('.');
	
	var here = window;
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

new Namespace(namespace_lib_core).using(function () {
	var ns = this;
	
	/** 
	 * creating a Performer
	 * @class 
	 */
	 clas(function Performer() {
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
	clas(function Utilitie() {
		def(function listen(target, type, func) {
			if (target.addEventListener)
				target.addEventListener(type, function (e) {
					func.perform(e);
				}, false);
			else if (target.attachEvent)
				target.attachEvent(type, function (e) {
					func.perform(e);
				});
		});
		
		def(function unlisten(target, type, func) {
			if (target.removeEventListener)
				target.removeEventListener(type, func);
			else if (target.attachEvent)
				target.detachEvent(type, func);
		})		
	});
	
	singleton(function Main () {
		init(function () {
			var util = ns.Utilitie.gen();
			var isIE = navigator.userAgent.toLowerCase().indexOf("msie") != -1;
			util.listen(window, isIE ? "onload" : "load", ns.Performer.gen(this,  function () {
					util.unlisten(window, isIE ? "onload" : "load", arguments.callee);
					if (this.runner) this.runner.call(window);
			}));
		});
		
		def(function main (runner) {
			this.runner = runner;
		});
	});
	
});