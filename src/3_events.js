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
 * @fileOverview イベントに関するオブジェクトが定義されています.
 */
 
new Namespace(namespace_lib_events).use(function() {
	var ns = this;
	// dynamical creating a internal namespace
	var nsi = new Namespace(ns.nsName + ".internal");
	var userAgent = new Namespace(namespace_lib_platform).browser.UserAgent.gen();
	
	/* internal */
	nsi.proto(function EventTargetSet(listener) {
		init(function (listener) {
			this.listener = listener;
		})
	});
	
	
	/** 
	* @class イベントを発行するための機能を定義しています.
	*/
	proto(function EventDispatcher() {
		/** 
		* @memberOf EventDispatcher 
		* @param 
		*/
		init(function (target) {
			this.observers = {};
			this.target = target;
		});
		
		/**
		* イベントリスナを追加します.
		* @param type {String} イベントタイプ.
		* @param callback {Function} イベント発生時に評価する関数.
		*/
		def(function addEventListener(type, callback) {
			var list = this.observers[type];
			var flg = false;
			if (list) {
				var numTargets = list.length;
				for (var i = 0; i < numTargets; i++)
					if (list[i] == callback)
						flg = true;
				if (!flg)
					list.push(callback);
			} else {
				this.observers[type] = [];
				this.observers[type].push(callback);
			}
			return flg;
		});
		
		/** 
		* addEventListener のエイリアス. 
		* @deprecated 将来的に廃止される可能性があります.
		*/
		def(function ae(type, callback) {
			this.addEventListener(type, callback);
		});
		
		/**
		* イベントリスナを削除します.
		* @param type {String} イベントタイプ.
		* @param callback {Function} 登録済み関数.
		*/
		def(function removeEventListener(type, callback) {
			var list = this.observers[type];
			if (!list) return;
			
			var numTargets = list.length;
			for (var i = 0; i < numTargets; i++) {
				if (list[i] && list[i] == callback) {
					list.splice(i, 1);
					return;
				}
			}
		});

		/** 
		* removeEventListener のエイリアス. 
		* @deprecated 将来的に廃止される可能性があります.
		*/
		def(function re(type, performer) {
			this.removeEventListener(type, performer);
		});
		
		def(function dispatchEvent(event) {
			var list = this.observers[event.type];
			if (list) {
				var numTargets = list.length;
				for (var i = 0; i < numTargets; i++) {
					if (list[i]) list[i].call(this, event);
				}
			}
		});
	});
	
	
	/** 
	* @class DOMに関するイベントを定義しています.
	*/
	proto(function DOMEvent() {
		var isIE = userAgent.isIE();
		if (isIE) {
			/** @memberOf DOMEvent */
			$$.INIT = "onload";
			/** @memberOf DOMEvent */
			$$.LOAD = "onload";
		} else {
			$$.INIT = "load";
			$$.LOAD = "load";
		}
	});
	
	
	/** 
	* @class DOMのマウス操作に関するイベントを定義しています.
	*/
	proto(function DOMMouseEvent() {
		var isIE = userAgent.isIE();
		if (isIE) {
			/** @memberOf DOMMouseEvent */
			$$.CLICK = "onclick";
			/** @memberOf DOMEvent */
			$$.MOUSE_DOWN = "onmousedown";
			/** @memberOf DOMEvent */
			$$.MOUSE_MOVE = "onmousemove";
			/** @memberOf DOMEvent */
			$$.MOUSE_OUT = "onmouseout";
			/** @memberOf DOMEvent */
			$$.MOUSE_OVER = "onmouseover";
			/** @memberOf DOMEvent */
			$$.MOUSE_UP = "onmouseup";
			/** @memberOf DOMEvent */
			$$.MOSUE_WHEEL = "onmousewheel";
		} else {
			$$.CLICK ="click";
			$$.MOUSE_DOWN = "mousedown";
			$$.MOUSE_MOVE = "mousemove";
			$$.MOUSE_OUT = "mouseout";
			$$.MOUSE_OVER = "mouseover";
			$$.MOUSE_UP = "mouseup";
			$$.MOSUE_WHEEL = "mousewheel";
		}
		
	});
	
	/** 
	* @class FLEvent
	*/
	proto(function FLEvent() {
		/**
		* @memberOf FLEvent
		* @param type {String} イベントタイプ
		* @param caller {Object} イベント発行元オブジェクト
		* @param origin {Event} JavaScript 実行環境ネイティブの Event オブジェクト
		*/
		init(function (type, caller, origin) {
			this.type = type;
			this.origin = origin;
			this.currentTarget = caller;
		});
		
		/**
		* デフォルトの処理実行をキャンセルします.
		*/
		def(function preventDefault() {
			if (this.origin.preventDefault)
				this.origin.preventDefault();
			else
				this.origin.returnValue = false;
		});
		
		/**
		* イベントの伝搬を停止します.
		*/
		def(function stopPropagation() {
			if (this.origin.stopPropagation)
				this.origin.stopPropagation();
			else
				this.origin.cancelBubbles = true;
		});
		
		/** @memberOf FLEvent */
		$$.APP_LAUNCH = "appLaunch";
		/** @memberOf FLEvent */
		$$.COMPLETE = "complete";
	});

	
	/** 
	* @class 機能拡張したマウスイベントを定義します.
	* @augments FLEvent
	*/
	proto(function FLMouseEvent() {
		ex(ns.FLEvent);
		
		init(function (type, caller, origin) {
			this.$super(type, caller, origin);
		})
		
		/** @memberOf FLMouseEvent */
		$$.CLICK = "click";
		/** @memberOf FLMouseEvent */
		$$.DOUBLE_CLICK = "doubleclick";
		/** @memberOf FLMouseEvent */
		$$.MOUSE_DOWN = "mousedown";
		/** @memberOf FLMouseEvent */
		$$.MOUSE_MOVE = "mousemove";
		/** @memberOf FLMouseEvent */
		$$.MOUSE_OUT = "mouseout";
		/** @memberOf FLMouseEvent */
		$$.MOUSE_OVER = "mouseover";
		/** @memberOf FLMouseEvent */
		$$.MOUSE_UP = "mouseup";
		/** @memberOf FLMouseEvent */
		$$.MOUSE_WHEEL = "mousewheel";
		/** @memberOf FLMouseEvent */
		$$.ROLL_OUT = "rollout";
		/** @memberOf FLMouseEvent */
		$$.ROLL_OVER = "rollover";
	});
});
