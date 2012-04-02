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
 * @fileOverview 幾何学に関するオブジェクトが定義されています.
 */
 
new Namespace(namespace_lib_geom).use(function() {
	var ns = this;
	
	 /** 
	 * @class 点を表します.
	 */
	proto(function Point() {
		/**
		* @memberOf Point
		* @param x {Number} x 座標
		* @param y {Number} y 座標　
		*/
		init(function(x, y) {
			this.x = x;
			this.y = y;
		});
		
		/** 
		* このPointを引数のPoint分移動します.
		* @param p {Point} 
		*/
		def(function add(p) {
			return ns.Point.gen(this.x + p.x, this.y + p.y);
		});
		
		/** 
		* Point オブジェクトのクローンを返します.
		* @return {Point} clone
		*/
		def(function clone() {
			return ns.Point.gen(this.x, this.y);
		});
		
		/**
		* ２点の差をスカラー値で返します.
		* @return {Number}
		*/
		def(function distance(p1, p2) {
			var dx = p1.x - p2.x;
			var dy = p1.y - p2.y;
			return Math.abs(Math.sqrt(dx*dx + dy*dy));
		});
		
		/** 
		* ２点が等しいかどうか評価します.
		* @return {Boolean}
		*/
		def(function equals(p) {
			return this.x == p.x && this.y == p.y;
		});
		
		/**
		* Pointの x, y 座標それぞれにオフセット分加算します.
		* @param dx {Number}
		* @param dy {Number}
		*/
		def(function offset(dx, dy) {
			this.x += dx;
			this.y += dy;
		});
		
		/** 
		* 引数に渡された Point 分を差し引いた新しい Point オブジェクトを返します.<br/>
		* 現在の Point オブジェクトの値は変更されません.
		* @param p {Point}
		*/
		def(function subtract(p) {
			return ns.Point.gen(this.x - p.x, this.y - p.y);
		});
		
		/**
		* 原点を (0, 0) とした場合のこの Point オブジェクトの原点からの距離を返します.
		* @return {Number}
		*/
		def(function getLength() {
			return Math.sqrt(this.x*this.x + this.y*this.y);
		});
		
		/**
		* ２点間を比 f (0 ~ 1) で線形補間します.
		* @param p1 {Point} 
		* @param p2 {Point}
		* @parma f {Number}
		* @return {Point} p1, p2 の割合 f に位置する新しい Point オブジェクト
		* @memberOf Point
		*/
		$$.def(function interpolate(p1, p2, f) {
			var dx = p2.x - p1.x;
			var dy = p2.y - p1.y;
			var tx = p1.x + dx * (1-f);
			var ty = p1.y + dy * (1-f);
			return ns.Point.gen(tx, ty);
		});
		
		/** 
		* 極座標から直交座標に変換します.
		* @memberOf Point
		*/
		$$.def(function polar(length, radian) {
			return ns.Point.gen(length * Math.cos(radian), length * Math.sin(radian));
		});
	});
	
	
	 /** 
	 * @class 矩形を表します.
	 */
	 proto(function Rectangle() {
		 /**
		 * @param x {Number} x 座標
		 * @param y {Number} y 座標
		 * @param w {Number} 幅
		 * @param h {Number} 高さ
		 * @memberOf Rectangle
		 */
	 	init(function (x, y, w, h) {
	 		this.x = x;
	 		this.y = y;
	 		this.width = w;
	 		this.height = h;
	 	});
		
		/**
		* Rectangleオブジェクトのクローンを返します.
		* @return {Rectangle} 
		*/
		def(function clone() {
			return ns.Rectangle.gen(this.x, this.y, this.width, this.height);
		});
		
		/** 
		* 指定されたポイントがこの Rectangle オブジェクトで定義される矩形領域内にあるかどうかを判別します。
		* @param x {Number} x 座標
 		* @param y {Number} y 座標
 		* @return {Boolean}  このオブジェクトに指定されたオブジェクトが含まれる場合は true を返します.
		*/
		def(function contains(x, y) {
			return (this.x < x && this.x + this.width > x) && (this.y < y && this.y + this.height > y);
		});
		
		/** 
		* 指定されたポイントがこの Rectangle オブジェクトで定義される矩形領域内にあるかどうかを判別します。
		* @param p {Point} Point
 		* @return {Boolean}  このオブジェクトに指定されたオブジェクトが含まれる場合は true を返します.
		*/
		def(function containsPoint(p) {
			return this.contains(p.x, p.y);
		});
		
		/** 
		* 指定された矩形領域がこの Rectangle オブジェクトで定義される矩形領域内にあるかどうかを判別します。
		* @param rect {Rectangle} 
 		* @return {Boolean}  このオブジェクトに指定されたオブジェクトが含まれる場合は true を返します.
		*/
		def(function containsRect(rect) {
			return this.contains(rect.x, rect.y) && this.contains(rect.x + rect.width, rect.y + rect.height);
		});
		
		/**
		* 引数に与えられた Rectangle オブジェクトと等しいかどうか判別します.
		* @param rect {Rectangle} 
		* @return {Boolean} 等しい場合には true を返します.
		*/
		def(function equals(rect) {
			return (this.x == rect.x && this.y == rect.y && this.width == rect.width && this.height == rect.height);
		});
		
		/** 
		* 幅、高さを拡張します.
		* @param dx {Number} offset x
		* @param dy {Number} offset y
		*/
		def(function inflate(dx, dy) {
			this.width += dx;
			this.height += dy;
		});
		
		/**
		* 幅、高さを拡張します.
		* @param p {Point} offsets
		*/
		def(function inflatePoint(p) {
			this.width += p.x;
			this.height += p.y;
		});
		
		/**
		* 引数に与えられた Rectangle オブジェクトと交差する領域を新しい Rectangle オブジェクトとして返します.
		* @return {Rectangle}
		*/
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
		
		/**
		* 引数に与えられた Rectangle オブジェクトと交差する領域があるかどうか判別します.
		* @param {Rectangle} 
		* @return 交差する領域がある場合に true を返します.
		*/
		def(function intersect(rect) {
			if (this.intersection)
				return true;
			else
				return false;
		});
		
		/**
		* 矩形を移動します.
		* @param dx {Number} offset x
		* @param dy {Number} offset y
		*/
		def(function offset(dx, dy) {
			this.x += dx;
			this.y += dy;
		});
		
		/**
		* 矩形を移動します.
		* @param dx {Point} offsets
		*/
		def(function offsetPoint() {
			this.x += p.x;
			this.y += p.y;
		});
		
		/**
		* ２つの矩形領域を合成します.
		* @param rect {Rectangle} 
		*/
		def(function union(rect) {
			var intersection = this.intersection(rect);
			var r = ns.Rectangle.gen(0,0,0,0);
			r.x = Math.min(this.x, rect.x);
			r.y = Math.min(this.y, rect.y);
			r.width = this.width + rect.width - intersection.width;
			r.height = this.height + rect.height - intersection.height;
			return r;
		});
		
		/**
		* 底辺の y 座標を返します.
		* @return {Number}
		*/
		def(function getBottom() {
			return this.y + this.height;
		});
		
		/** 
		* 右下隅の座標を返します.
		* @return {Point}
		*/
		def(function getBottomRight() {
			return ns.Point.gen(this.getRight(), this.getBottom());
		});
		
		/**
		* 右辺の x 座標を返します.
		* @return {Number}
		*/
		def(function getRight() {
			return this.x + this.width;
		});
		
		/**
		* サイズを返します.
		* @return {Point}
		*/
		def(function getSize() {
			return ns.Point.gen(this.width, this.height);
		});
		
		/**
		* 左上隅の座標を返します.
		* @return {Point}
		*/
		def(function getTopLeft() {
			return ns.Point.gen(this.x, this.y);
		});
	 });
	 
	 /** 
	 * @class 3 * 3 行列
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
	 	
	 	/**
	 	* クローンを返します.
	 	* @return {Matrix}
	 	*/
	 	def(function clone() {
		 	return ns.Matrix.gen(this.a, this.b, this.c, this.d, this.tx, this.ty);
	 	});
	 	
	 	/**
	 	* 乗算します.
	 	* @param m {Matrix}
	 	*/
	 	def(function cancat(m) {
	 		var a = this.a, b = this.b, c = this.c, d = this.d, tx = this.tx, ty = this.ty;	
			this.a = a * m.a + c * m.b;
			this.c = a * m.c + c * m.d;
			this.tx = a * m.tx + c * m.ty + tx;
			this.b = b * m.a + d * m.b;
			this.d = b * m.c + d * m.d;	
			this.ty = b * m.tx + d * m.ty + ty;
	 	});
	 	
	 	/**
	 	* 単位行列にします
	 	*/
	 	def(function identity() {
	 		this.a = this.d = 1;
			this.b = this.c = this.tx = this.ty = 0;
	 	});
	 	
	 	/** 
	 	* 回転させます.
	 	* @param radian {Number} 
	 	*/
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
	 	
	 	/**
	 	* 伸縮します.
	 	* @param scl {Number}
	 	*/
	 	def(function scale(scl) {
	 		var s = ns.Matrix.gen(scl, 0, 0, scl, 0, 0);
			this.concat(s);
	 	});
	 	
	 	/**
	 	* 平行移動します.
	 	* @param dx {Number}
	 	* @param dy {Number}
	 	*/
	 	def(function translate(dx, dy) {
	 		this.tx += dx;
			this.ty += dy;
	 	});
	 });
	 
});
