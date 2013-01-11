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
 * @fileOverview 名前空間オブジェクトが定義されています.<br/>
 */

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
	* クラスからインスタンスを得ます.<br/>
	* 引数に渡したオブジェクトは,クラスのコンストラクタにそのまま引き渡されます.
	**/
	this.gen = function() {
		var obj = new this();
		if (obj.initialize != undefined) {
			// if (obj.initialize.superMethod) obj.initialize.superMethod.apply(obj, arguments);
			obj.initialize.apply(obj, arguments);
		}
		return obj;
	};
	
	/**
	* クラスからシングルトンインスタンスを得ます.<br/>
	* 引数に渡したオブジェクトは,クラスのコンストラクタにそのまま引き渡されます.
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
	
	/**
	* コンストラクタを定義します.
	* @param initialize コンストラクト時に呼ばれるクロージャ
	**/
	this.init = function(initialize) {
		self.substance.prototype.initialize = wrap("initialize", initialize);
	};
	
	/**
	* 継承元を指定します.
	* @param obj Namespace に定義されている、Singleton ではないクラス(非インスタンス)を渡します.
	**/
	this.ex = function(obj) {
		var proto = new obj();
		self.substance.superClass = obj.prototype;
		self.substance.prototype = proto;
		self.substance.prototype.$super = $super;
	};
	
	/**
	* オブジェクトをモジュールとして mixin します.<br/>
	* @param {Object} module include したいオブジェクト. これは JavaScript native Object でも可です.
	* @param {Boolean} overwrite true が渡された場合、既に存在する同名のメンバを上書きします.
	**/
	this.include = function(module, overwrite) {
		for (var p in module) {
			if (overwrite || this[p] == undefined) {
				this[p] = module[p];
			}
		}
	};
	
	/**
	* getter メソッドを定義します.<br/>
	* getter に対応していない環境では定義は行われません.
	* @param name {String} getter名
	* @param func getterが呼び出された時に呼ばれるクロージャ.
	**/
	this.getter = function (name, func) {
		var p = self.substance.prototype;
		
		var fullname = "get" + name;
		self.substance.prototype[fullname] = wrap(fullname, func);
		
		if ("__defineGetter__" in p) {
			p.__defineGetter__(name, func);
		}
	}
	
	/**
	* setter メソッドを定義します.<br/>
	* setter に対応していない環境では定義は行われません.
	* @param name {String} setter名
	* @param func setterが呼び出された時に呼ばれるクロージャ.
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
	* メソッドを定義します.
	* @param method {Function} 名前付き関数.この関数の名前がメソッド名になります.
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
FunctionPrototype = new FunctionPrototype();


var InternalNamespacePrototype = function() {
	this.nsName = "";
	var self = this;
	
	/**
	* @memberOf Namespace.prototype
	* @description この名前空間のスコープを使用します.
	* @param func クロージャ
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
	* @memberOf Namespace.prototype
	* @description Class (プロトタイプ)を定義します.
	* @param namedFunc 名前付き関数. この関数名がクラス名になります.
	* @description このメソッドに渡す名前付き関数のスコープでのみ有効になる,<br/>
	*  ex, include, init, def, getter, setter, $$ <br/>
	* というグローバル関数・変数があります.<br/>
	* それぞれの説明は下記を参照してください.<br/><br/>
	* ex : {@link ex}<br/>
	* include : {@link include}<br/>
	* init : {@link init}<br/>
	* def : {@link def}<br/>
	* getter : {@link getter}<br/>
	* setter : {@link setter}<br/>
	* $$ : クラスへの参照. $$ に対して def を呼び出すとクラスメソッド,<br/>
	* $$.hoge = "hoge" とするとクラス変数になります.
	*/
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
	
	/**
	* @memberOf Namespace.prototype
	* @description Singleton Class (プロトタイプ)を定義します.
	* @param namedFunc 名前付き関数. この関数名がクラス名になります.
	* @description このメソッドに渡す名前付き関数のスコープでのみ有効になる,<br/>
	*  ex, include, init, def, getter, setter, $$ <br/>
	* というグローバル関数・変数があります.<br/>
	* それぞれの説明は下記を参照してください.<br/><br/>
	* ex : {@link ex}<br/>
	* include : {@link include}<br/>
	* init : {@link init}<br/>
	* def : {@link def}<br/>
	* getter : {@link getter}<br/>
	* setter : {@link setter}<br/>
	* $$ : クラスへの参照. $$ に対して def を呼び出すとクラスメソッド,<br/>
	* $$.hoge = "hoge" とするとクラス変数になります.
	*/
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

/**
* @class all classes are defined to Namespace class.
* @param str 名前空間を String 型で指定します. (例: "jp.example.hoge")
* @description "jp.example.hoge" を引数に Namespace を new した場合,<br/>
* jp, jp.example, jp.example.hoge というオブジェクトが作成されます.<br/>
* すでに存在する場合は新しく作成されることはありません.
*/
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
	 * @class bind object with function
	 */
	 proto(function Performer() {
	 	/**
	 	* @constructs
	 	* @param target オブジェクト
	 	* @param func 関数
	 	* @param func の引数
	 	*/
	 	init(function(target, func, args) {
	 		this.target = target;
	 		this.func = func;
	 		this.args = args;
	 	});
	 	
	 	/**
	 	* func を実行します.
	 	*/
	 	def(function perform() {
	 		this.func.apply(this.target, arguments);
	 	})
	 });
	
	/** 
	 * @private
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
	* @class メインクラス.
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
		
		/**
		* アプリケーションの初期化処理が終わった時に,引数に渡されたクロージャが実行されます.
		*/
		def(function main(runner) {
			this.runner = runner;
		})
	})
	
});