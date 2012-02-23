new Namespace(namespace_lib_tween).using(function() {
	var ns = this;
	
	/** 
	* creating a Interpolator
	* @class 値を easing 関数を使用して補間します
	*/
	clas(function Interpolator() {
		init(function(to, from, step, easing) {
			this.values = [];
			var t = 0;
			var c = to - from;
			while (t++ < step) {
				var v = easing.calculate(t, from, c, step);
				this.values.push(v);
			}
		});
	});
	
	
	/** 
	* creating a Animator
	* @class 
	*/
	clas(function Animator() {
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
	
	
	/*
	-------------------------------------------------------------------------
		Bounce
	-------------------------------------------------------------------------
	*/
	this.Bounce = function() {}
	this.Bounce.easeIn = function(){
		var that = {};
		that.calculate = function(t, b, c, d){
			if ((t = (d - t) / d) < (1 / 2.75)) { return c - (c * (7.5625 * t * t)) + b; }
			if (t < (2 / 2.75)) { return c - (c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75)) + b; }
			if (t < (2.5 / 2.75)) { return c - (c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375)) + b; }
			return c - (c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375)) + b;
		};
		return that;
	}();
	
	this.Bounce.easeOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){
			if ((t /= d) < (1 / 2.75)) { return c * (7.5625 * t * t) + b; }
			else if (t < (2 / 2.75)) { return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b; }
			else if (t < (2.5 / 2.75)) { return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b; }
			else { return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b; }
		};
		return that;
	}();

	this.Bounce.easeInOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){
			var s = 1.70158;
			if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		};
		return that;
	}();

	/*
	-------------------------------------------------------------------------
		Circ
	-------------------------------------------------------------------------
	*/
	this.Circ = function() {}
	this.Circ.easeIn = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b; };
		return that;
	}();
	
	this.Circ.easeOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return c * Math.sqrt(1 - (t=t/d-1)*t) + b; };
		return that;
	}();
	
	this.Circ.easeInOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		};
		return that;
	}();
	
	/*
	-------------------------------------------------------------------------
		Cubic
	-------------------------------------------------------------------------
	*/
	this.Cubic = function() {}
	this.Cubic.easeIn = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return c * (t /= d) * t * t + b; };
		return that;
	}();
	
	this.Cubic.easeOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return c * ((t = t / d - 1) * t * t + 1) + b; };
		return that;
	}();
	
	this.Cubic.easeInOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return ((t /= d / 2) < 1) ? c / 2 * t * t * t + b : c / 2 * ((t -= 2) * t * t + 2) + b; };
		return that;
	}();
	
	/*
	-------------------------------------------------------------------------
		Elastic
	-------------------------------------------------------------------------
	*/
	this.Elastic = function() {}
	this.Elastic.easeIn = function(){
		var that = {};
		that.calculate = function(t, b, c, d){
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
		};
		return that;
	}();
	
	this.Elastic.easeOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){
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
		};
		return that;
	}();
	
	this.Elastic.easeInOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){
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
		};
		return that;
	}();
	
	/*
	-------------------------------------------------------------------------
		Expo
	-------------------------------------------------------------------------
	*/
	this.Expo = function() {}
	this.Expo.easeIn = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b; };
		return that;
	}();
	
	this.Expo.easeOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b; };
		return that;
	}();
	
	this.Expo.easeInOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){
			if (t == 0)
				return b;
			if (t == d)
				return b + c;
			if ((t /= d / 2) < 1)
				return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		};
		return that;
	}();
	
	/*
	-------------------------------------------------------------------------
		Quad
	-------------------------------------------------------------------------
	*/
	this.Quad = function() {}
	this.Quad.easeIn = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return c * (t /= d) * t + b; };
		return that;
	}();
	
	this.Quad.easeOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return -c * (t /= d) * (t - 2) + b; };
		return that;
	}();
	
	this.Quad.easeInOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){
			if ((t /= d / 2) < 1)
			{
				return c / 2 * t * t + b;
			}
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		};
		return that;
	}();
	
	/*
	-------------------------------------------------------------------------
		Quart
	-------------------------------------------------------------------------
	*/
	this.Quart = function() {}
	this.Quart.easeIn = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return c * Math.pow(t / d, 4) + b; };
		return that;
	}();
	
	this.Quart.easeOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return -c * (Math.pow(t / d - 1, 4) - 1) + b; };
		return that;
	}();
	
	this.Quart.easeInOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){
			if ((t /= d / 2) < 1)
			{
				return c / 2 * t * t * t * t + b;
			}
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		};
		return that;
	}();
	
	/*
	-------------------------------------------------------------------------
		Quintic
	-------------------------------------------------------------------------
	*/
	this.Quintic = function() {}
	this.Quintic.easeIn = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return c * Math.pow(t/d, 5) + b; };
		return that;
	}();
	
	this.Quintic.easeOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return c * (Math.pow(t/d-1,5) + 1) + b; };
		return that;
	}();
	
	this.Quintic.easeInOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){
			if ((t/=d/2) < 1)
				return c/2 * Math.pow (t, 5) + b;
			return c/2 * (Math.pow (t-2, 5) + 2) + b;
		};
		return that;
	}();
	
	/*
	-------------------------------------------------------------------------
		Sine
	-------------------------------------------------------------------------
	*/
	this.Sine = function() {}
	this.Sine.easeIn = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return c * (1 - Math.cos(t/d * (Math.PI/2))) + b; };
		return that;
	}();
	
	this.Sine.easeOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return c * Math.sin(t/d * (Math.PI/2)) + b; };
		return that;
	}();
	
	this.Sine.easeInOut = function(){
		var that = {};
		that.calculate = function(t, b, c, d){ return c/2 * (1 - Math.cos(Math.PI*t/d)) + b; };
		return that;
	}();

});


