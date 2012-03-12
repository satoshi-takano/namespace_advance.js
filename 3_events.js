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

new Namespace(namespace_lib_events).use(function() {
	var ns = this;
	// dynamical creating a internal namespace
	var nsi = new Namespace(ns.nsName + ".internal");
	var userAgent = new Namespace(namespace_lib_core).UserAgent.gen();
	
	/* internal */
	nsi.proto(function EventTargetSet(listener) {
		init(function (listener) {
			this.listener = listener;
		})
	});
	
	
	/** 
	* 
	* @class 
	*/
	proto(function EventDispatcher() {
		init(function (target) {
			this.observers = {};
			this.target = target;
		});
		
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
		
		// shortcut of the addEventListener method
		def(function ae(type, callback) {
			this.addEventListener(type, callback);
		});
		
		def(function removeEventListener(type, callback) {
			var list = this.observers[type];
			var numTargets = list.length;
			for (var i = 0; i < numTargets; i++) {
				if (list[i] && list[i] == callback) {
					list.splice(i, 1);
					return;
				}
			}
		});

		// shortcut of the removeEventListener method
		def(function re(type, performer) {
			this.removeEventListener(type, performer);
		});
		
		def(function dispatchEvent(event) {
			var list = this.observers[event.type];
			if (list) {
				var numTargets = list.length;
				for (var i = 0; i < numTargets; i++) {
					list[i].call(this, event);
				}
			}
		});
	});
	
	
	/** 
	* accessing a DOMEvent object
	* @class 
	*/
	proto(function DOMEvent() {
		var isIE = userAgent.isIE();
		if (isIE) {
			$$.INIT = "onload";
			$$.LOAD = "onload";
		} else {
			$$.INIT = "load";
			$$.LOAD = "load";
		}
	});
	
	
	/** 
	* accessing a DOMMouseEvent object
	* @class 
	*/
	proto(function DOMMouseEvent() {
		var isIE = userAgent.isIE();
		if (isIE) {
			$$.CLICK = "onclick";
			$$.MOUSE_DOWN = "onmousedown";
			$$.MOUSE_MOVE = "onmousemove";
			$$.MOUSE_OUT = "onmouseout";
			$$.MOUSE_OVER = "onmouseover";
			$$.MOUSE_UP = "onmouseup";
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
	* creating a FLEvent
	* @class flash の Eventぽく
	*/
	proto(function FLEvent() {
		init(function (type, caller, origin) {
			this.type = type;
			this.origin = origin;
			this.currentTarget = caller;
		});
		
		def(function preventDefault() {
			if (this.origin.preventDefault)
				this.origin.preventDefault();
			else
				this.origin.returnValue = false;
		});
		
		def(function stopPropagation() {
			if (this.origin.stopPropagation)
				this.origin.stopPropagation();
			else
				this.origin.cancelBubbles = true;
		});
		
		$$.APP_LAUNCH = "appLaunch";
		$$.COMPLETE = "complete";
	});

	
	/** 
	* creating a FLMouseEvent
	* @class flash の MouseEvent
	*/
	proto(function FLMouseEvent() {
		ex(ns.FLEvent);
		
		init(function (type, caller, origin) {
			this.$super(type, caller, origin);
		})
		
		$$.CLICK = "click";
		$$.DOUBLE_CLICK = "doubleclick";
		$$.MOUSE_DOWN = "mousedown";
		$$.MOUSE_MOVE = "mousemove";
		$$.MOUSE_OUT = "mouseout";
		$$.MOUSE_OVER = "mouseover";
		$$.MOUSE_UP = "mouseup";
		$$.MOUSE_WHEEL = "mousewheel";
		$$.ROLL_OUT = "rollout";
		$$.ROLL_OVER = "rollover";
	});
});
