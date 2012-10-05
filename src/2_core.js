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
 * @fileOverview 全体で使用する目的の基礎的なオブジェクトが定義されています.
 */
 
new Namespace(namespace_lib_core).use(function() {
	var ns = this;
	
	/** 
	 * @class NotificationCenter へ post する通知オブジェクト.
	 * 通知名と任意の型のUserDataの対を保持する.
	 */
	 proto(function Notification() {
	 	/**
	 	* @memberOf Notification
	 	* @param {String} name 通知名
		* @param {Object} userData 引き回す用の Object
		*/
	 	init(function(name, userData) {
	 		this.name = name;
	 		this.userData = userData;
	 	});
	 	
	 	/** @return {String} 通知名を返します. */
	 	def(function getName() {
	 		return this.name;
	 	});
	 	
	 	/** @return {Object} コンストラクタに渡されたUserDataを返します. */
	 	def(function getUserData() {
	 		return this.userData;
	 	})
	 });
	 
	 
	 /** 
	 * @class 通知センター. 多対多のイベント通知構造を表します.
	 */
	 singleton(function NotificationCenter() {
	 	$$.targets = {};
	 	
	 	/** Observer を追加します.
	 	* @param target {Object} 任意の型の Observer.
	 	* @param func {Function} イベント通知を受け取る関数.
	 	* @param notifName {String} 受け取る通知名.
	 	* @memberOf NotificationCenter
	 	*/
	 	$$.addObserver = function(target, func, notifName) {
			var obj = {target:target, func:func};
			if (!this.targets.hasOwnProperty(notifName))
				this.targets[notifName] = [];
			var list = this.targets[notifName];
			var isAlreadyPushed = false;
			var l = list.length;
			for (var i = 0; i < l; i++)
			{
				if (target == list[i].target)
				{
					isAlreadyPushed = true;
					break;
				}
			}
			if (!isAlreadyPushed)
				list.push(obj);
		}
		
		/** 
		* Observer を削除します.
	 	* @memberOf NotificationCenter
		*/
		$$.removeObserver = function(target, notifName) {
			var list = this.targets[notifName];
			var l = list.length;
			for (var i = 0; i < l; i++) {
				if (target == list[i].target) {
					list.splice(i, 1);
					return;
				}
			}
		}
		
		/**
		* 通知を発行します.
		* @param notification {Notification} 通知オブジェクト.
	 	* @memberOf NotificationCenter
		*/
		$$.postNotification = function(notification) {
			var list = this.targets[notification.name];
			
			if (list == null)
				return;
			var l = list.length;
			for (var i = 0; i < l; i++)
			{
				var obj = list[i];
				obj.func.call(obj.target, notification.object);
			}
		}
	 })
	 
	 /** 
	 * @class コンストラクタがよばれた時刻を保持します. 経過時間などの出力に使います.
	 */
	 proto(function Timestamp() {
	 	/** @memberOf Timestamp */
	 	init(function() {
	 		this.created = new Date();
	 	});
	 	
	 	/** @return {String} オブジェクトの文字列表現 */
	 	def(function toString() {
	 		var str = "* Timestamp : " + this.stamp() + " msec";
			return str;
	 	});
	 	
	 	/** @return {Number} オブジェクトが作成されてからの経過時間をミリ秒単位で返します. */
	 	def(function stamp() {
	 		return (new Date().getTime() - this.created.getTime());
	 	});
	 });
	 
	 
	 /** 
	 * @class ユニークな識別子.
	 */
	 proto(function Identifier() {
		 /** @memberOf Identifier */
	 	init(function() {
	 		this.id = null;
	 		generate.call(this);
	 	});
	 	
		$$.IDs = [];
	 	
	 	/** @private */
	 	function generate() {
	 		this.id = (new Date()).getTime();
			while (!check.call(this))
				this.id = Math.round(this.id * Math.random());
			this.$class.IDs.push(this.id);
	 	}
	 	
	 	/** @private */
	 	function check() {
	 		var numIDs = this.$class.IDs.length;
			var res = true;
			for (var i = 0; i < numIDs; i++) {
				if (this.$class.IDs[i] == this.id)
					res = false;
			}
			return res;
	 	}
	 });
	 
	 
	 /** 
	 * @class 関数を遅延評価します.
	 */
	 proto(function Wait() {
	 	/**
	 	* @memberOf Wait
	 	* @param time {Number} 遅延時間をミリ秒単位で指定します.
	 	* @param callback {Function} 指定時間経過後に呼ばれる関数.
	 	*/
	 	init(function(time, callback) {
	 		this.timer = setTimeout(function(){
	 			callback.call();
	 		}, time);
	 		callback = callback;
	 	});
	 	
	 	/** 遅延をキャンセルします. キャンセルした場合指定関数は呼ばれません. */
	 	def(function cancel() {
	 		clearTimeout(this.timer);
	 	});
	 });
	
	/**
	* @class 数値の範囲を表します.
	*/
	proto(function Range() {
		/**
		* @memberOf Range
		* @min {Number} 範囲の最小値
		* @max {Number} 範囲の最大値
		*/
		init(function(min, max) {
			this.min = min;
			this.max = max;
		});
		
		/**
		* 引数に渡された Range オブジェクトが、自身の値の範囲内に収まる場合に true を返します.
		* @param {Range} 評価対象の Range オブジェクト
		* @return {Boolean}
		*/
		def(function contains(range) {
			return (this.min <= range.min && range.max <= this.max);
		});
		
		/**
		* 値を別の Range での値に置き換えます.
		* @description 例えば 0 ~ 100 の Range オブジェクトに対して,<br/>
		* remap(50, Range.gen(100, 200)); を評価した場合,<br/>
		* 150 が返されます.
		* @param value {Number} この範囲内での１点の値.
		* @param range {Range} 置き換える範囲
		* @return
		*/
		def(function remap(value, range) {
			return range.min + (range.length()) * this.ratio(value);
		})
		
		/** @return {Number} 範囲の大きさを返します. */
		def(function length() {
			return this.max - this.min;
		})
		
		/** 
		* 引数に渡された値の、この範囲内での割合を返します.
		* @param val {Number} 評価する値.
		* @return {Number} 
		*/
		def(function ratio (val) {
			return (val - this.min) / this.length();
		})
		
	});
	
	/**
	* @class 特定の操作を表します.
	* 
	**/
	proto(function Operation() {
		/**
		* @memberOf Operation
		* @param scope {Object} 関数評価時のスコープ.
		* @param func {Function} 操作を表す関数.
		* @param args {Array} 関数評価時に引数として渡される arguments 配列. *関数評価時は可変長引数として渡されます.
		*/
		init(function(scope, func, args) {
			this.scope = scope;
			this.func = func;
			this.args = args;
		})
		
		/** 評価します */
		def(function execute() {
			this.func.apply(this.scope, this.args);
		})
		
	})
	
	/**
	* @class 操作シーケンススタック.
	* 
	**/
	proto(function OperationQueue() {
		/** @memberOf OperationQueue */
		init(function() {
			this.operations = [];
		})
		
		/** 
		* 操作を追加します.
		* @param op {Operation} Operation オブジェクト.
		*/
		def(function push(op) {
			this.operations.push(op);
		})
		
		/** 
		* スタックの最後尾にある Operation オブジェクトを削除します.
		* @return {Operation} 削除した Operation オブジェクト.
		*/
		def(function pop() {
			return this.operations.pop();
		})
		
		def(function clear() {
			this.operations = [];
		})
		
		/**
		* 一連の操作シーケンスをスタックに追加された順で実行します.
		*/
		def(function execute() {
			this.operations.each(function (op) {
				op.execute();
			})
		})
	})
	
	/**
	* @class FPS など全体の情報を提供します. #予定
	* 
	**/
	singleton(function System() {
		init(function(args) {
			
		})
		
		$$.FPS = 30;
	})
	
	
	/**
	* @class 操作を記録できるAPIを提供します.
	* @description オブジェクトにモジュールとして include して使用します.
	**/
	proto(function Recordable() {
		init(function() {
			this.opq = ns.OperationQueue.gen();
		})
		
		/** 
		* 操作を記録します.
		* @param op {Operation} 記録する Operation. 省略した場合は rec() を呼び出した関数が記録されます.<br/>
		* Recordable をモジュールとして include している場合は this.rec() と呼びだすことで<br/>
		* 現在居るスコープの関数が操作として記録されます.
		*/
		def(function rec(op) {
			if (!op) {
				var caller = arguments.callee.caller;
				op = ns.Operation.gen(this, caller, caller.arguments);
			}
			this.opq.push(op);
		})
		
		/** 
		* 記録した一連の操作を順に実行します.
		*/
		def(function playback() {
			this.opq.execute();
		})
		
		/**
		* 記録した操作をすべて消去します.
		*/
		def(function clear() {
			this.opq.clear();
		})
	})
	
});