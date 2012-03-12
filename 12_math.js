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
		$$.sigma = function sigma(s, e) {
			return (s + e) * e / 2;
		}
		
		$$.PI = 3.141592653589793;
		$$.E = 2.718281828459045;
	})
	
})