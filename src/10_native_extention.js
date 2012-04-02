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
* @fileOverview JavaScript の組み込み型を拡張します.
*/

// Number's extention
Number.prototype.times = function(closure, scope) {
	for (var i = 0; i < this; i++) {
		closure.call(scope || arguments.callee.caller, i);
	}
};
Number.prototype.upto = function(max, closure, scope) {
	for (var i = this + 0; i <= max; i++) {
		closure.call(scope || arguments.callee.caller, i)
	}
}
Number.prototype.downto = function(min, closure, scope) {
	for (var i = this + 0; min <= i; i--) {
		closure.call(scope || arguments.callee.caller, i);
	}
}
Number.prototype.step = function(limit, step, closure, scope) {
	for (var i = this + 0; i <= limit; i += step) {
		closure.call(scope || arguments.callee.caller, i);
	}
}

Number.prototype.after = function(closure, scope) {
	setTimeout(function () {
		closure.call(scope || arguments.callee.caller);
	}, this + 0);
}

Number.prototype.frames = function(closure, scope) {
	var i = 0;
	var step = this + 0;
	var interval = 1 / (new Namespace(namespace_lib_core).System.FPS);
	var tid = setInterval(function() {
		if (closure.call(scope || arguments.callee.caller, i) == false) clearInterval(tid);
		i++;
		if (i == step) clearInterval(tid);
	}, interval);
}

// Array's extention
Array.prototype.each = function(closure, scope) {
	for (var i = 0, l = this.length; i < l; i++) {
		closure.call(scope || arguments.callee.caller, this[i]);
	}
}