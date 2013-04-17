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
 * Defines the core objects.
 * @version 0.6.0
 */

/**
* @namespace advanced.core
**/
new Namespace("advanced.core").use(function() {
	console.log('imported ', this.nsName)
	var ns = this;
	
	/**
	* The Proc object represents the procedure.
	* @private
	* @class Proc
	* @param {function} callee
	**/
	proto(function Proc() {
		init(function(callee) {
			this.callee = callee;
			this.name = callee.name || "lamda";
			if (callee.owner) this.owner = callee.owner.name;
			else this.owner = null;
		})
	})

	/**
	* Stacktrace
	* @class Backtrace
	**/
	proto(function Stacktrace() {
		init(function(callee) {
			this.stack = [];
			this.stack.push(new advanced.core.Proc(callee));
			while (callee.name) {
				if (callee.caller)
					this.stack.push(new advanced.core.Proc(callee.caller));
				callee = callee.caller;
			}
		})

		/**
		* Output a stack trace to the console.
		* @method dump
		* @memberOf Backtrace#
		**/
		def(function dump() {
			console.log(" - ", this.stack[0])
			for (var i = 1, l = this.stack.length; i < l; i++) {
				console.log("	from : ", this.stack[i])
			}
		})
	})
	
	/** 
	 * The notification object.
	 * @class Notification
	 * @param {string} name The name of this notification.
	 * @param {object} userData The user data of this notification.
	 */
	 proto(function Notification() {
	 	init(function(name, userData) {
	 		this.name = name;
	 		this.userData = userData;
	 	});
	 	
	 	/**
		* Returns the name of this notification.
		* @method getName
		* @memberOf Notification#
		* @return {string}
		**/
	 	def(function getName() {
	 		return this.name;
	 	}); 
	 	
	 	/**
		* Returns the user data of this notification.
		* @method getUserData
		* @memberOf Notification#
		* @return {object}
		**/
	 	def(function getUserData() {
	 		return this.userData;
	 	})
	 });
	 
	 
	 /** 
	 * The NotificationCenter object. (singleton)
	 * @class NotificationCenter
	 */
	 singleton(function NotificationCenter() {
	 	$$.targets = {};
	 	
	 	/** 
		* Adds an notification observer object.
		* @method addObserver
		* @memberOf NotificationCenter
	 	* @param {object} target The observer object.
	 	* @param {function} func The function that will be called when the notification is posted.
	 	* @param {string} notifName The name of the notification that will be observed.
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
		* Removes an notification observer object.
		* @method removeObserver
		* @memberOf NotificationCenter
		* @param {object} target The observer object.
	 	* @param {string} notifName The name of the notification that will be removed from list of observers.
		**/
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
		* Posts the notification to the observers.
		* @method postNotification
		* @memberOf NotificationCenter
		* @param {Notification} notification The notification object that will be posted.
		*/
		$$.postNotification = function(notification) {
			var list = this.targets[notification.name];
			
			if (list == null)
				return;
			var l = list.length;
			for (var i = 0; i < l; i++)
			{
				var obj = list[i];
				obj.func.call(obj.target, notification);
			}
		}
	 })
	 
	 /** 
	 * The Timestamp object.
	 * @class Timestamp
	 */
	 proto(function Timestamp() {
	 	init(function() {
	 		this.created = new Date();
	 	});
	 	
	 	def(function toString() {
	 		var str = "* Timestamp : " + this.stamp() + " msec";
			return str;
	 	});
	 	
		/**
		* Determines the elapsed time from the construction.
		* @method stamp
		* @memberOf Timestamp#
		* @returns {number} Elapsed time from the construction in milliseconds. 
		**/
	 	def(function stamp() {
	 		return (new Date().getTime() - this.created.getTime());
	 	});
	 });
	 
	 
	 /** 
	 * The Identifier object.
	 * @class Identifier
	 */
	 proto(function Identifier() {
		 /** @memberOf Identifier */
	 	init(function() {
			/**
			* The ID.
			* @member {number} id
			* @memberOf Identifier#
			**/
	 		this.id = null;
	 		generate.call(this);
	 	});
	 	
		$$.IDs = [];
	 	
	 	function generate() {
	 		this.id = (new Date()).getTime();
			while (!check.call(this))
				this.id = Math.round(this.id * Math.random());
			this.$class.IDs.push(this.id);
	 	}
	 	
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
	 * Waits for the time that specified by the argument.
	 * @class Wait
	 * @param {number} time The delay time in milliseconds.
	 * @param {function} callback The function that will be called when after waiting the delay time.
	 */
	 proto(function Wait() {
	 	init(function(time, callback) {
	 		this.timer = setTimeout(function(){
	 			callback.call();
	 		}, time);
	 		callback = callback;
	 	});
	 	
	 	/** 
		* Cancels the waiting.
		* @method cancel
		* @memberOf Wait#
		**/
	 	def(function cancel() {
	 		clearTimeout(this.timer);
	 	});
	 });
	
	/**
	* Represents range of any values from any values.
	* @class Range
	* @param {number} The minimum value in the range.
	* @param {number} That maximum value in the range.
	*/
	proto(function Range() {
		init(function(min, max) {
			/** 
			* The minimum value in the range.
			* @member {number} min
			* @memberOf Range#
			**/
			this.min = min;
			/**
			* The maximum value in the range.
			* @member {number} max
			* @memberOf Range#
			**/
			this.max = max;
		});
		
		/**
		* Determine whether this range contains the range that is passed to the argument.
		* @method contains
		* @memberOf Range#
		* @param {Range} 評価対象の Range オブジェクト
		* @returns {boolean} 
		*/
		def(function contains(range) {
			return (this.min <= range.min && range.max <= this.max);
		});
		
		/**
		* Rearranges the range that is passed to the argument to this range.<br/>
		* e.g. If you passes 50 and Range(100, 200) to the remap function of Range(0, 100), the function will returns 150.
		* @method remap
		* @memberOf Range#
		* @param {number} value A value in the range that is passed to the second argument.
		* @param {Range} range The range object.
		* @returns {Range} The new range object.
		*/
		def(function remap(value, range) {
			return range.min + (range.length()) * this.ratio(value);
		})
		
		/**
		* Determines the length of this range object.
		* @method length
		* @memberOf Range#
		* @returns {number} The length of this range object.
		**/
		def(function length() {
			return this.max - this.min;
		})
		
		/** 
		* Determines the ratio of the value that is passed to the argument in this range object.
		* @method ratio
		* @memberOf Range#
		* @param val {number} The value that will be determines.
		* @returns {number} The ratio.
		*/
		def(function ratio (val) {
			return (val - this.min) / this.length();
		})
		
	});
	
	/**
	* The Operation object.
	* @class Operation
	* @param {object} scope
	* @param {function} func
	* @param {array} args
	**/
	proto(function Operation() {
		init(function(scope, func, args) {
			this.scope = scope;
			this.func = func;
			this.args = args;
		})
		
		/** 
		* Executes the operation in scope that was passed to the first argument of constructor.
		* @method execute
		* @memberOf Operation#
		**/
		def(function execute() {
			this.func.apply(this.scope, this.args);
		})
		
	})
	
	/**
	* The queue of operation objects.
	* @class OperationQueue
	**/
	proto(function OperationQueue() {
		/** @memberOf OperationQueue */
		init(function() {
			this.operations = [];
		})
		
		/** 
		* Adds new operation to the queue.
		* @method push
		* @memberOf OperationQueue#
		* @param {Operation} op The operation object.
		*/
		def(function push(op) {
			this.operations.push(op);
		})
		
		/** 
		* Removes the last operation object in this queue.
		* @method pop
		* @memberOf OperationQueue#
		* @returns {Operation} The operation object that is removed from this operation.
		*/
		def(function pop() {
			return this.operations.pop();
		})
		
		/**
		* Clears this queue.
		* @method clear
		* @memberOf OperationQueue#
		**/
		def(function clear() {
			this.operations = [];
		})
		
		/**
		* Executes the operations that is contained in this queue serially.
		*/
		def(function execute() {
			var l = this.operations.length;
			for (var i = 0; i < l; i++) this.operations[i].execute();
		})
	})
	
	/**
	* @private
	* @class System
	**/
	singleton(function System() {
		init(function(args) {
			
		})
		
		$$.FPS = 30;
	})
	
	
	/**
	* The Recordable object.
	* @class Recordable
	**/
	proto(function Recordable() {
		init(function() {
			this.opq = new ns.OperationQueue();
		})
		
		/** 
		* Records the operation that is passed to the argument.
		* @method rec
		* @memberOf Recordable#
		* @param {Operation} op If you passes null value, this method will records the function that is invoker.
		*/
		def(function rec(op) {
			if (!op) {
				var caller = arguments.callee.caller;
				op = new ns.Operation(this, caller, caller.arguments);
			}
			this.opq.push(op);
		})
		
		/** 
		* Playbacks the recorded operations.
		* @method playback
		* @memberOf Recordable#
		*/
		def(function playback() {
			this.opq.execute();
		})
		
		/**
		* Clears all recorded operations.
		* @method clear
		* @memberOf Recordable#
		*/
		def(function clear() {
			this.opq.clear();
		})
	})
    
    
	/**
	* The DisplayLink object
	* @class DisplayLink
	**/
	proto(function DisplayLink() {
		init(function(fps) {
            if (fps == undefined) fps = 60;
			var targets = this._targets = [];
			var renderFunc = this._renderFunc = requestAnimationFrame();
			var offset = 1000 / fps;
            var pre = new Date().getTime();
            
			function render() {
                var now = new Date().getTime();
                if (offset < now - pre) {
    				var l = targets.length;
    				for (var i = 0; i < l; i++) {
    					var t = targets[i];
    					t.renderFunc.call(t.target);
    				}
                    pre = now;
                }
                renderFunc(render);
			}
			render();
		})
		
		/**
		* Adds new display refresh observer.
		* @method addTarget
		* @memberOf DisplayLink#
		* @param {object} target The observer
		* @param {function} renderFunc 
		**/
		def(function addTarget(target, renderFunc) {
			var targets = this._targets;
			var l = targets.length;
			var alreadyAdded = false;
			for (var i = 0; i < l; i++) {
				if (targets[i].target == target) {
					targets[i].renderFunc = renderFunc;
					alreadyAdded = true;
				}
			}
			if (!alreadyAdded) {
				this._targets.push({target:target, renderFunc:renderFunc});
			}
		})
		
		/**
		* Removes the display refresh observer.
		* @method removeTarget
		* @memberOf DisplayLink#
		* @param {object} target The observer
		**/
		def(function removeTarget(target) {
			var targets = this._targets;
			var l = targets.length;
			for (var i = 0; i < l; i++) {
				if (targets[i].target == target) {
					targets.splice(i, 1);
				}
			}
		})
		
	})
	
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
	
	function requestAnimationFrame(renderFunc) {
		return window.requestAnimationFrame		||
				window.webkitRequestAnimationFrame	||
				window.mozRequestAnimationFrame		||
				window.oRequestAnimationFrame		||
				window.msRequestAnimationFrame		||
				function(callback, element){
					window.setTimeout(callback, 1000 / 60);
				};
	}
});
