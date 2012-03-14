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

new Namespace(namespace_lib_math).use(function () {
	var ns = this;
	/**
	* @archetype Math
	* 
	**/
	proto(function Math() {
		// To initialize when the Math.gen(params) called.
		init(function() {
			
		})
		
		// fact {replace the description here}.
		$$.factorial = function(n) {
			if (1 < n) return n * ns.Math.factorial(n - 1) 
			else return 1;
		}
		
		// sigma {replace the description here}.
		$$.sigma = function(s, e) {
			return (s + e) * e / 2;
		}
		
		$$.DFT = function(dt, samples, real, imag) {
			var amp = 0;
			var calcR = [];
			var calcI = [];
			for (var i = 0; i < dt; i++) {
				calcR[i] = 0;
				calcI[i] = 0;
				var fn = i / dt;
				var pi2ft = 2 * PI * fn;
				for (var t = 0; t < dt; t++) {
					calcR[i] += samples[t] * cos(pi2ft * t);
					calcI[i] -= samples[t] * sin(pi2ft * t);
				}
			}
			for (i = 0; i < dt; i++) {
				real[i] = calcR[i];
				imag[i] = calcI[i];
			}
		}
		
		$$.sugar = function() {
			var nativeMath = window.Math;
			window.PI = nativeMath.PI;
			window.E = nativeMath.E;
			window.sqrt = nativeMath.sqrt;
			window.abs = nativeMath.abs;
			window.acos = nativeMath.acos;
			window.asin = nativeMath.atan;
			window.atan = nativeMath.atan;
			window.atan2 = nativeMath.atan2;
			window.ceil = nativeMath.ceil;
			window.sin = nativeMath.sin;
			window.cos = nativeMath.cos;
			window.tan = nativeMath.tan;
			window.exp = nativeMath.exp;
			window.floor = nativeMath.floor;
			window.LN10 = nativeMath.LN10;
			window.LN2 = nativeMath.LN2;
			window.log = nativeMath.log;
			window.LOG10E = nativeMath.LOG10E;
			window.LOG2E = nativeMath.LOG2E;
			window.max = nativeMath.max;
			window.min = nativeMath.min;
			window.random = nativeMath.random;
			window.round = nativeMath.round;
			window.SQRT1_2 = nativeMath.SQRT1_2;
			window.SQRT2 = nativeMath.SQRT2;
			window.DFT = this.DFT;
		}
		
		$$.PI = 3.141592653589793;
		$$.E = 2.718281828459045;
	})
	
})