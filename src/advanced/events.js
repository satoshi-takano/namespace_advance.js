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
 * @file Set of prototypes related to the custom event.
 * @version 0.6.0
 */

/**
* @namespace advanced.events
**/
new Namespace("advanced.events").require(["advanced.platform"], function() {
    this.use(function() {
        console.log('imported ', this.nsName)
        
        var ns = this;
        // dynamical creating a internal namespace
        var nsi = new Namespace(ns.nsName + ".internal");
        var userAgent = new (new Namespace("advanced.platform")).UserAgent();

        /* internal */
        nsi.proto(function EventTargetSet(listener) {
            init(function (listener) {
                this.listener = listener;
            })
        });


        /** 
        * Event dispatcher.
        * @class EventDispatcher
        * @param {object} target 
        */
        proto(function EventDispatcher() {
            init(function (target) {
                this.observers = {};
                this.target = target;
            });

            /**
            * Add an event listener.
            * @method addEventListener
            * @memberOf EventDispatcher#
            * @param {string} type Event type.
            * @param {function} callback Function that called when fired the event.
            */
            def(function addEventListener(type, callback) {
                if (type == undefined) {
                    console.error("argument 0 : undefined");
                    return;
                }
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
            * Synonym of addEventListener.
            * @method ae
            * @memberOf EventDispatcher#
            * @param {string} type Event type.
            * @param {function} callback Function that called when fired the event.
            */
            def(function ae(type, callback) {
                this.addEventListener(type, callback);
            });

            /**
            * Remove an event listener.
            * @method removeEventListener
            * @memberOf EventDispatcher#
            * @param {string} type Event type.
            * @param {function} callback Function that added by addEventListener.
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
            * Returns whether the EventDispatcher has listener related to the event type.
            * @method hasEventListener
            * @memberOf EventDispatcher#
            * @returns {Boolean}
            **/
            def(function hasEventListener(type) {
                var list = this.observers[type];
                if (!list || list.length == 0) return false;
                else return true;
            })


            /**
            * Synonym of addEventListener.
            * @method re
            * @memberOf EventDispatcher#
            * @param {string} type Event type.
            * @param {function} callback Function that added by addEventListener.
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
        * Prototype that related to the DOM event.
        * @class DOMEvent
        */
        proto(function DOMEvent() {
            var isIE = userAgent.isIE();
            if (isIE) {
                /** 
                * @constant {string} INIT
                * @memberOf DOMEvent 
                **/
                $$.INIT = "onload";

                /** 
                * @constant {string} LOAD
                * @memberOf DOMEvent 
                **/
                $$.LOAD = "onload";
            } else {
                $$.INIT = "load";
                $$.LOAD = "load";
            }
        });


        /** 
        * Prototype that related to the DOM mouse event.
        * @class DOMMouseEvent
        */
        proto(function DOMMouseEvent() {
            var isIE = userAgent.isIE();
            if (isIE) {
                /** 
                * @constant {string} CLICK
                * @memberOf DOMMouseEvent 
                **/
                $$.CLICK = "onclick";
                /** 
                * @constant {string} MOUSE_DOWN
                * @memberOf DOMMouseEvent 
                **/
                $$.MOUSE_DOWN = "onmousedown";
                /** 
                * @constant {string} MOUSE_MOVE
                * @memberOf DOMMouseEvent 
                **/
                $$.MOUSE_MOVE = "onmousemove";
                /** 
                * @constant {string} MOUSE_OUT
                * @memberOf DOMMouseEvent 
                **/
                $$.MOUSE_OUT = "onmouseout";
                /** 
                * @constant {string} MOUSE_OVER
                * @memberOf DOMMouseEvent 
                **/
                $$.MOUSE_OVER = "onmouseover";
                /** 
                * @constant {string} MOUSE_UP
                * @memberOf DOMMouseEvent 
                **/
                $$.MOUSE_UP = "onmouseup";
                /** 
                * @constant {string} MOUSE_WHEEL
                * @memberOf DOMMouseEvent 
                **/
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
        * Root prototype that related to custom event.
        * @class Event
        **/
        proto(function Event() {
            init(function(type, caller, origin) {
                this.type = type;
                this.origin = origin;
                this.currentTarget = caller;
            })
        })

        /**
        * Prototype that releated the touch event.
        * @class TouchEvents
        * @augments Event
        **/
        proto(function TouchEvent() {
            ex(ns.Event)

            /** 
            * @constant {string} TOUCH_START
            * @memberOf TouchEvent 
            **/
            $$.TOUCH_START = "touchstart";
            /** 
            * @constant {string} TOUCH_MOVE
            * @memberOf TouchEvent 
            **/
            $$.TOUCH_MOVE = "touchmove";
            /** 
            * @constant {string} TOUCH_ENT
            * @memberOf TouchEvent 
            **/
            $$.TOUCH_END = "touchend";
        })


        /** 
        * Prototype looks like the Event class of ActionScript3.0.
        * @class FLEvent
        * @augments Event
        * @param {string} type event type.
        * @param {object} caller
        * @param {Event} [origin] JavaScript native event.
        */
        proto(function FLEvent() {
            ex(ns.Event)

            init(function (type, caller, origin) {
                this.$super(type, caller, origin)
                this.doBubbling = true;
            });

            /**
            * Cancel the default processing.
            * @method preventDefault
            * @memberOf FLEvent
            */
            def(function preventDefault() {
                if (this.origin.preventDefault)
                    this.origin.preventDefault();
                else
                    this.origin.returnValue = false;
            });

            /**
            * Stop the propagation of event.
            * @method stopPropagation
            * @memberOf FLEvent
            */
            def(function stopPropagation() {
                this.doBubbling = false;
                if (this.origin.stopPropagation)
                    this.origin.stopPropagation();
                else
                    this.origin.cancelBubbles = true;
            });

            /** 
            * @constant {string} APP_LAUNCH
            * @memberOf FLEvent
            **/
            $$.APP_LAUNCH = "appLaunch";
            /** 
            * @constant {string} COMPLETE
            * @memberOf FLEvent
            **/
            $$.COMPLETE = "complete";
        });


        /** 
        * Prototype looks like the MouseEvent class of ActionScript3.0.
        * @class FLMouseEvent
        * @augments FLEvent
        * @param {string} type event type.
        * @param {object} caller
        * @param {Event} [origin] JavaScript native event.
        */
        proto(function FLMouseEvent() {
            ex(ns.FLEvent);

            init(function (type, caller, origin) {
                this.$super(type, caller, origin);
                /** 
                * @member {number} mosueX
                * @memberOf FLMouseEvent#
                **/
                this.mouseX = 0;
                /** 
                * @member {number} mosueY
                * @memberOf FLMouseEvent#
                **/
                this.mouseY = 0;
            })

            /** 
            * @constant {string} CLICK
            * @memberOf FLMouseEvent
            **/
            $$.CLICK = "click";
            /** 
            * @constant {string} DOUBLE_CLICK
            * @memberOf FLMouseEvent
            **/
            $$.DOUBLE_CLICK = "doubleclick";
            /** 
            * @constant {string} MOUSE_DOWN
            * @memberOf FLMouseEvent
            **/
            $$.MOUSE_DOWN = "mousedown";
            /** 
            * @constant {string} MOUSE_MOVE
            * @memberOf FLMouseEvent
            **/
            $$.MOUSE_MOVE = "mousemove";
            /** 
            * @constant {string} MOUSE_OUT
            * @memberOf FLMouseEvent
            **/
            $$.MOUSE_OUT = "mouseout";
            /** 
            * @constant {string} MOUSE_OVER
            * @memberOf FLMouseEvent
            **/
            $$.MOUSE_OVER = "mouseover";
            /** 
            * @constant {string} MOUSE_UP
            * @memberOf FLMouseEvent
            **/
            $$.MOUSE_UP = "mouseup";
            /** 
            * @constant {string} MOUSE_WHEEL
            * @memberOf FLMouseEvent
            **/
            $$.MOUSE_WHEEL = "mousewheel";
            /** 
            * @constant {string} ROLL_OUT
            * @memberOf FLMouseEvent
            **/
            $$.ROLL_OUT = "rollout";
            /** 
            * @constant {string} ROLL_OVER
            * @memberOf FLMouseEvent
            **/
            $$.ROLL_OVER = "rollover";
        });
        
    })
})