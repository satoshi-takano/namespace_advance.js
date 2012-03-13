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

new Namespace(namespace_lib_geom).use(function() {
	var ns = this;
	
	 /** 
	 * creating a Point
	 * @class flash の Point
	 */
	proto(function Point() {
		init(function(x, y) {
			this.x = x;
			this.y = y;
		});
		
		def(function add(p) {
			return ns.Point.gen(this.x + p.x, this.y + p.y);
		});
		
		def(function clone() {
			return ns.Point.gen(this.x, this.y);
		});
		
		def(function distance(p1, p2) {
			var dx = p1.x - p2.x;
			var dy = p1.y - p2.y;
			return Math.abs(Math.sqrt(dx*dx + dy*dy));
		});
		
		def(function equals(p) {
			return this.x == p.x && this.y == p.y;
		});
		
		def(function offset(dx, dy) {
			this.x += dx;
			this.y += dy;
		});
		
		def(function subtract(p) {
			return ns.Point.gen(this.x - p.x, this.y - p.y);
		});
		
		def(function getLength() {
			return Math.sqrt(this.x*this.x + this.y*this.y);
		});

		$$.def(function interpolate(p1, p2, f) {
			var dx = p2.x - p1.x;
			var dy = p2.y - p1.y;
			var tx = p1.x + dx * (1-f);
			var ty = p1.y + dy * (1-f);
			return ns.Point.gen(tx, ty);
		});
		
		$$.def(function polar(length, radian) {
			return ns.Point.gen(length * Math.cos(radian), length * Math.sin(radian));
		});
	});
	
	
	 /** 
	 * creating a Rectangle
	 * @class flash の Rectangle
	 */
	 proto(function Rectangle() {
	 	init(function (x, y, w, h) {
	 		this.x = x;
	 		this.y = y;
	 		this.width = w;
	 		this.height = h;
	 	});
		
		def(function clone() {
			return ns.Rectangle.gen(this.x, this.y, this.width, this.height);
		});
		
		def(function contains(x, y) {
			return (this.x < x && this.x + this.width > x) && (this.y < y && this.y + this.height > y);
		});
		
		def(function containsPoint() {
			return this.contains(p.x, p.y);
		});
		
		def(function containsRect(rect) {
			return this.contains(rect.x, rect.y) && this.contains(rect.x + rect.width, rect.y + rect.height);
		});
		
		def(function equals(rect) {
			return (this.x == rect.x && this.y == rect.y && this.width == rect.width && this.height == rect.height);
		});
		
		def(function inflate(dx, dy) {
			this.width += dx;
			this.height += dy;
		});
		
		def(function inflatePoint(p) {
			this.width += p.x;
			this.height += p.y;
		});
		
		def(function intersection(rect) {
			var r = ns.Rectangle.gen(0, 0, 0, 0);
			r.x = Math.max(this.x, rect.x);
			r.y = Math.max(this.y, rect.y);
			var w;
			if (this.getRight() < rect.getRight())
				w = this.getRight() - rect.x;
			else
				w = rect.getRight() - this.x;
			var h;
			if (this.getBottom() < rect.getBottom())
				h = this.getBottom() - rect.y;
			else
				h = rect.getBottom() - this.y;
			r.width = w;
			r.height = h;
			if (0 < r.width && 0 < r.height)
				return r;
			else
				return null;
		});
		
		def(function intersect(rect) {
			if (this.intersection)
				return true;
			else
				return false;
		});
		
		def(function offset(dx, dy) {
			this.x += dx;
			this.y += dy;
		});
		
		def(function offsetPoint() {
			this.x += p.x;
			this.y += p.y;
		});
		
		def(function union(rect) {
			var intersection = this.intersection(rect);
			var r = ns.Rectangle.gen(0,0,0,0);
			r.x = Math.min(this.x, rect.x);
			r.y = Math.min(this.y, rect.y);
			r.width = this.width + rect.width - intersection.width;
			r.height = this.height + rect.height - intersection.height;
			return r;
		});
		
		def(function getBottom() {
			return this.y + this.height;
		});
		
		def(function getBottomRight() {
			return ns.Point.gen(this.getRight(), this.getBottom());
		});
		
		def(function getRight() {
			return this.x + this.width;
		});
		
		def(function getSize() {
			return ns.Point.gen(this.width, this.height);
		});
		
		def(function getTopLeft() {
			return ns.Point.gen(this.x, this.y);
		});
	 });
	 
	 /** 
	 * creating a Matrix
	 * @class flash の Matrix
	 */
	 proto(function Matrix() {
	 	init(function (a, b, c, d, tx, ty) {
	 		this.a = a;
	 		this.b = b;
	 		this.c = c;
	 		this.d = d;
	 		this.tx = tx;
	 		this.ty = ty;
	 	});
	 	
	 	def(function clone() {
		 	return ns.Matrix.gen(this.a, this.b, this.c, this.d, this.tx, this.ty);
	 	});
	 	
	 	def(function cancat(m) {
	 		var a = this.a, b = this.b, c = this.c, d = this.d, tx = this.tx, ty = this.ty;	
			this.a = a * m.a + c * m.b;
			this.c = a * m.c + c * m.d;
			this.tx = a * m.tx + c * m.ty + tx;
			this.b = b * m.a + d * m.b;
			this.d = b * m.c + d * m.d;	
			this.ty = b * m.tx + d * m.ty + ty;
	 	});
	 	
	 	def(function detailTransformPoint() {
	 		var x = p.x, y = p.y;
			var retVal = ns.Point.gen(0, 0);
			retVal.x = x * this.a + y * this.c;
			retVal.y = x * this.b + y * this.d;
			return retVal;
	 	});
	 	
	 	def(function identity() {
	 		this.a = this.d = 1;
			this.b = this.c = this.tx = this.ty = 0;
	 	});
	 	
	 	def(function rotate(radian) {
	 		var rot = ns.Matrix.gen(0, 0, 0, 0, 0, 0);
	 		var s = Math.sin(radian);
	 		var c = Math.cos(radian);
			rot.a = c;
			rot.b = s;
			rot.c = -s;
			rot.d = c;
			this.concat(rot);
	 	});
	 	
	 	def(function scale(scl) {
	 		var s = ns.Matrix.gen(scl, 0, 0, scl, 0, 0);
			this.concat(s);
	 	});
	 	
	 	def(function translate(dx, dy) {
	 		this.tx += dx;
			this.ty += dy;
	 	});
	 });
	 
});
