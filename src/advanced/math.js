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
* @fileOverview 計算に関するオブジェクトが定義されています.
*/ 

new Namespace("advanced.math").use(function () {
	console.log('imported ', this.nsName)
	
	var ns = this;
	var M = Math;
	/**
	* @class Math
	* 
	**/
	proto(function Math() {
		/** @memberOf Math */
		init(function() {
			
		})
		
		/**
		* 階上を求める.
		* @param n {Number}
		* @return {Number}
		* @memberOf Math
		*/
		$$.factorial = function(n) {
			if (1 < n) return n * ns.Math.factorial(n - 1) 
			else return 1;
		}
		
		/**
		* 総和を求める.
		* @param s {Number}
		* @param e {Number}
		* @return {Number}
		* @memberOf Math
		*/
		$$.sigma = function(s, e) {
			return (s + e) * e / 2;
		}
		
		/**
		* 任意の値を底とし,対数求める.
		* @param n {Number}
		* @return {Number}
		* @memberOf Math
		*/
		$$.log = function(base, trueValue) {
			return M.log(trueValue) / M.log(base);
		}
		
		/**
		* 各演算のためのメソッドをグローバルオブジェクトに展開する.
		*/
		$$.sugar = function() {
			var nativeMath = global.Math;
			global.PI = nativeMath.PI;
			global.E = nativeMath.E;
			global.sqrt = nativeMath.sqrt;
			global.abs = nativeMath.abs;
			global.acos = nativeMath.acos;
			global.asin = nativeMath.atan;
			global.atan = nativeMath.atan;
			global.atan2 = nativeMath.atan2;
			global.ceil = nativeMath.ceil;
			global.sin = nativeMath.sin;
			global.cos = nativeMath.cos;
			global.tan = nativeMath.tan;
			global.exp = nativeMath.exp;
			global.floor = nativeMath.floor;
			global.LN10 = nativeMath.LN10;
			global.LN2 = nativeMath.LN2;
			global.log = nativeMath.log;
			global.LOG10E = nativeMath.LOG10E;
			global.LOG2E = nativeMath.LOG2E;
			global.max = nativeMath.max;
			global.min = nativeMath.min;
			global.random = nativeMath.random;
			global.round = nativeMath.round;
			global.SQRT1_2 = nativeMath.SQRT1_2;
			global.SQRT2 = nativeMath.SQRT2;
			global.DFT = this.DFT;
			global.FFT = this.FFT;
		}
		
		/**
		* @class 離散フーリエ変換
		* 
		**/
		proto(function DFT() {
			/** 
			* @param N {Number} DFT size
			* @memberOf DFT 
			*/
			init(function(N) {
				this.N = N;
			})
			
			/**
			* 離散フーリエ変換　します.
			* @description 引数の x, y には実行後、周波数領域での値が入っています.
			* @param x {Array} 実数の入った配列.
			* @param y {Array} 虚数の入った配列.
			*/
			def(function dft(x, y) {
				var dt = this.N;
				var calcR = [];
				var calcI = [];
				for (var i = 0; i < dt; i++) {
					calcR[i] = 0;
					calcI[i] = 0;
					var fn = i / dt;
					var pi2ft = 2 * M.PI * fn;
					for (var t = 0; t < dt; t++) {
						calcR[i] += x[t] * M.cos(pi2ft * t);
						calcI[i] -= x[t] * M.sin(pi2ft * t);
					}
				}
				for (i = 0; i < dt; i++) {
					x[i] = calcR[i];
					y[i] = calcI[i];
				}
			})
		})
		
		
		/**
		* @class 高速フーリエ変換
		**/
		proto(function FFT() {
			/**
			* @param N {Number} FFT size
			* @memberOf FFT
			*/
			init(function(N) {
				this.N = N;
				
 			 	this.bitrev = [];
	 			betrev(N, this.bitrev);
				this.sintable = [];
				sintbl(N, this.sintable);
			})
			
			/**
			* 高速フーリエ変換します.
			* @description 引数の x, y には実行後、周波数領域での値が入っています.
			* @param x {Array} 実数の入った配列.
			* @param y {Array} 虚数の入った配列.
			*/
			def(function fft(x, y) {
				last_n = 0;
				var bitrev = this.bitrev;
				var sintbl = this.sintable;
				var n = this.N;
				
				var i, j, k, ik, h, d, k2, n4, inverse,
				t, s, c, dx, dy;
				
				if (n < 0) {
					n = -n; 
					inverse = 1;
				} else inverse = 0;
				
				n4 = n >> 2;
				
				for (i = 0; i < n; i++) {
					j = bitrev[i];
					if (i < j) {
						t = x[i]; x[i] = x[j]; x[j] = t;
						t = y[i]; y[i] = y[j]; y[j] = t;
					}
				}
				for (k = 1; k < n; k = k2) {
					h = 0; k2 = k + k; d = n / k2;
					for (j = 0; j < k; j++) {
						c = sintbl[h + n4];
						if (inverse) s = -sintbl[h];
						else s = sintbl[h];
						for (i = j; i < n; i += k2) {
							ik = i + k;
							dx = s * y[ik] + c * x[ik];
							dy = c * y[ik] - s * x[ik];
							x[ik] = x[i] - dx; x[i] += dx;
							y[ik] = y[i] - dy; y[i] += dy;
						}
						h += d;
					}
				}
			})
			
			
			function betrev(N, table) {
				var i = 0, j = 0, k = 0;
				table[0] = 0;
				while (++i < N) {
					k = N >> 1;
					while (k <= j) { j -= k; k >>= 1; }
					j += k;
					table[i] = j;
				}
			}
			
			function sintbl(N, table) {
				var i, n2, n4, n8, c, s, dc, ds, t;
				n2 = N >> 1;
				n4 = N >> 2;
				n8 = N >> 3;
				t = M.sin(M.PI / N);
				dc = 2 * t * t;
				ds = M.sqrt(dc * (2 - dc));
				t = 2 * dc;
				c = table[n4] = 1;
				s = table[0] = 0;
				for (i = 1; i < n8; i++) {
					c -= dc;
					dc += t * c;
					s += ds;
					ds -= t * s;
					table[i] = s;
					table[n4 - i] = c;
				}
				if (n8 != 0) table[n8] = M.sqrt(0.5);
				for (i = 0; i < n4; i++) table[n2 - i] = table[i];
				for (i = 0; i < n2 + n4; i++) table[i + n2] = -table[i];
			}
		})
	})
})