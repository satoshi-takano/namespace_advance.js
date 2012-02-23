new Namespace(namespace_lib_events).using(function() {
	var ns = this;
	// dynamical creating a internal namespace
	var nsi = new Namespace(ns.nsName + ".internal");
	var userAgent = new Namespace(namespace_lib_core).UserAgent.gen();
	
	/* internal */
	nsi.clas(function EventTargetSet(listener) {
		init(function (listener) {
			this.listener = listener;
		})
	});
	
	
	/** 
	* 
	* @class 
	*/
	clas(function EventDispatcher() {
		init(function (target) {
			this.observers = {};
			this.target = target;
		});
		
		def(function addEventListener(type, performer) {
			var list = this.observers[type];
			var flg = false;
			if (list) {
				var numTargets = list.length;
				for (var i = 0; i < numTargets; i++)
					if (list[i] == performer)
						flg = true;
				if (!flg)
					list.push(performer);
			} else {
				this.observers[type] = [];
				this.observers[type].push(performer);
			}
			return flg;
		});
		
		// shortcut of the addEventListener method
		def(function ae(type, performer) {
			this.addEventListener(type, performer);
		});
		
		def(function removeEventListener(type, performer) {
			var list = this.observers[type];
			var numTargets = list.length;
			for (var i = 0; i < numTargets; i++) {
				if (list[i] && list[i].callback == performer.callback) {
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
					list[i].perform();//.call(this, event);
				}
			}
		});
	});
	
	
	/** 
	* accessing a DOMEvent object
	* @class 
	*/
	clas(function DOMEvent() {
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
	clas(function DOMMouseEvent() {
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
	clas(function FLEvent() {
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
	clas(function FLMouseEvent() {
		ex(ns.FLEvent);
		
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
