// Number's extention
Number.prototype.times = function(closure) {
	for (var i = 0; i < this; i++) {
		closure.call(this, i);
	}
};
Number.prototype.upto = function(max, closure) {
	for (var i = this + 0; i <= max; i++) {
		closure.call(this, i)
	}
}
Number.prototype.downto = function(min, closure) {
	for (var i = this + 0; min <= i; i--) {
		closure.call(this, i);
	}
}
Number.prototype.step = function(limit, step, closure) {
	for (var i = this + 0; i <= limit; i += step) {
		closure.call(this, i);
	}
}

// Array's extention
Array.prototype.each = function(closure) {
	for (var i = 0, l = this.length; i < l; i++) {
		closure.call(this, this[i]);
	}
}