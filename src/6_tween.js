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

new Namespace(namespace_lib_tween).use(function() {
	var ns = this;
	
	/** 
	* creating a Interpolator
	* @class 値を easing 関数を使用して補間します
	*/
	proto(function Interpolator() {
		init(function(to, from, step, easing) {
			this.values = [];
			var t = 0;
			var c = to - from;
			while (t++ < step) {
				var v = easing.call(this, t, from, c, step);
				this.values.push(v);
			}
		});
	});
	
	
	/** 
	* creating a Animator
	* @class 
	*/
	proto(function Animator() {
		init(function (delay) {
			this.delay = delay;
			this.next = null;
		});
		
		def(function tween(target, style, to, step, easing, delay) {
			var self = this;
			this.delay += (delay || 0);
			setTimeout(function() {
				var cnt = 0;
				var styleValue = target[style];
				var from = parseInt(styleValue);
				var interp = ns.Interpolator.gen(to, from, step, easing);
				var values = interp.values;
				step = step-1;
				var timerID = setInterval(function(){
					target[style] = values[cnt];
					if (self.upFunc)
						self.upFunc.call();
					if (cnt >= step) {
						clearInterval(timerID);
						if (self.cbFunc)
							self.cbFunc.call()
					}
					if (target.rendering) target.rendering();
					cnt++;
				}, 1000 / 60);
			}, this.delay);
			this.next = ns.Animator.gen(this.delay + 1000 / 60 * step);
			
			return this;
		});
	});
	
	
	/**
	* @archetype Bounce
	* 
	**/
	singleton(function Bounce() {
		// To initialize when the Bounce.gen(params) called.
		init(function() {
		})

		// easeIn {replace the description here}.
		$$.def(function easeIn(t, b, c, d) {
			if ((t = (d - t) / d) < (1 / 2.75)) { return c - (c * (7.5625 * t * t)) + b; }
			if (t < (2 / 2.75)) { return c - (c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75)) + b; }
 			if (t < (2.5 / 2.75)) { return c - (c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375)) + b; }
 			return c - (c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375)) + b;
		})
		
		// easeOut {replace the description here}.
		def(function easeOut(t, b, c, d) {
				if ((t /= d) < (1 / 2.75)) { return c * (7.5625 * t * t) + b; }
				else if (t < (2 / 2.75)) { return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b; }
				else if (t < (2.5 / 2.75)) { return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b; }
				else { return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b; }
		})
		
		// easeInOut {replace the description here}.
		def(function easeInOut(args) {
			var s = 1.70158;
			if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		})
	})
	
	/**
	* @archetype Circ
	* 
	**/
	singleton(function Circ() {
		// To initialize when the Circ.gen(params) called.
		init(function() {
		})
		
		$$.def(function easeIn(t, b, c, d) {
			return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
		})
		
		// out {replace the description here}.
		$$.def(function easeOut(t, b, c, d) {
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		})
		
		// easeInOut {replace the description here}.
		$$.def(function easeInOut(t, b, c, d) {
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		})
	})
	
	/**
	* @archetype Cubic
	* 
	**/
	singleton(function Cubic() {
		// To initialize when the Cubic.gen(params) called.
		init(function() {
		})
		
		// in {replace the description here}.
		$$.def(function easeIn(t, b, c, d) {
			return c * (t /= d) * t * t + b;
		})
		
		// out {replace the description here}.
		$$.def(function easeOut(t, b, c, d) {
			return c * ((t = t / d - 1) * t * t + 1) + b;
		})
		
		// easeInOut {replace the description here}.
		$$.def(function easeInOut(t, b, c, d) {
			return ((t /= d / 2) < 1) ? c / 2 * t * t * t + b : c / 2 * ((t -= 2) * t * t + 2) + b;
		})
	})
	
	/**
	* @archetype Elastic
	* 
	**/
	singleton(function Elastic() {
		// To initialize when the Elastic.gen(params) called.
		init(function() {
		})
		
		// in {replace the description here}.
		$$.def(function easeIn(t, b, c, d) {
			var a, p;
			if (t == 0)
				return b;
			if ((t /= d) == 1)
				return b + c;
			if (!p)
				p = d * .3;
			if (!a || a < Math.abs(c))
			{
				a = c;
				var s = p / 4;
			}
			else
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		})
		
		// out {replace the description here}.
		$$.def(function easeOut(t, b, c, d) {
			var a, p;
			if (t == 0)
				return b;
			if ((t /= d) == 1)
				return b + c;
			if (!p)
				p = d * .3;
			if (!a || a < Math.abs(c))
			{
				a = c;
				var s = p / 4;
			}
			else
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
		})
		
		// easeInOut {replace the description here}.
		$$.def(function easeInOut(t, b, c, d) {
			var a, p;
			if (t == 0)
				return b;
			if ((t /= d / 2) == 2)
				return b + c;
			if (!p)
				p = d * (.3 * 1.5);
			if (!a || a < Math.abs(c))
			{
				a = c;
				var s = p / 4;
			}
			else
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			if (t < 1)
				return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
		})
	})
	
	/**
	* @archetype Expo
	* 
	**/
	singleton(function Expo() {
		// To initialize when the Expo.gen(params) called.
		init(function() {
		})
		
		// in {replace the description here}.
		$$.def(function easeIn(t, b, c, d) {
			return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
		})
		
		// out {replace the description here}.
		$$.def(function easeOut(t, b, c, d) {
			return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
		})
		
		// easeInOut {replace the description here}.
		$$.def(function easeInOut(t, b, c, d) {
			if (t == 0)
				return b;
			if (t == d)
				return b + c;
			if ((t /= d / 2) < 1)
				return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		})
	})
	
	/**
	* @archetype Qaud
	* 
	**/
	singleton(function Qaud() {
		// To initialize when the Qaud.gen(params) called.
		init(function() {
		})
		
		// in {replace the description here}.
		$$.def(function easeIn(t, b, c, d) {
			return c * (t /= d) * t + b;
		})
		
		// out {replace the description here}.
		$$.def(function easeOut(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		})
		
		// easeInOut {replace the description here}.
		$$.def(function easeInOut(t, b, c, d) {
			if ((t /= d / 2) < 1)
			{
				return c / 2 * t * t + b;
			}
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		})
	})
	
	/**
	* @archetype Quart
	* 
	**/
	singleton(function Quart() {
		// To initialize when the Quart.gen(params) called.
		init(function() {
		})
		
		// in {replace the description here}.
		$$.def(function easeIn(t, b, c, d) {
			return c * Math.pow(t / d, 4) + b;
		})
		
		// out {replace the description here}.
		$$.def(function easeOut(t, b, c, d) {
			return -c * (Math.pow(t / d - 1, 4) - 1) + b;
		})
		
		// easeInOut {replace the description here}.
		$$.def(function easeInOut(t, b, c, d) {
			if ((t /= d / 2) < 1)
			{
				return c / 2 * t * t * t * t + b;
			}
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		})
	})
	
	/**
	* @archetype Quintic
	* 
	**/
	singleton(function Quintic() {
		// To initialize when the Quintic.gen(params) called.
		init(function() {
		})
		
		// in {replace the description here}.
		$$.def(function easeIn(t, b, c, d) {
			return c * Math.pow(t/d, 5) + b;
		})
		
		// out {replace the description here}.
		$$.def(function easeOut(t, b, c, d) {
			return c * (Math.pow(t/d-1,5) + 1) + b;
		})
		
		// easeInOut {replace the description here}.
		$$.def(function easeInOut(t, b, c, d) {
			if ((t/=d/2) < 1)
				return c/2 * Math.pow (t, 5) + b;
			return c/2 * (Math.pow (t-2, 5) + 2) + b;
		})
	})
	
	/**
	* @archetype Sine
	* 
	**/
	singleton(function Sine() {
		// To initialize when the Sine.gen(params) called.
		init(function() {
		})
		
		// in {replace the description here}.
		$$.def(function easeIn(t, b, c, d) {
			return c * (1 - Math.cos(t/d * (Math.PI/2))) + b; 
		})
		
		// out {replace the description here}.
		$$.def(function easeOut(t, b, c, d) {
			return c * Math.sin(t/d * (Math.PI/2)) + b; 
		})
		
		// easeInOut {replace the description here}.
		$$.def(function easeInOut(t, b, c, d) {
			return c/2 * (1 - Math.cos(Math.PI*t/d)) + b;
		})
	})

});


