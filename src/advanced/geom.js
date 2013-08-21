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
 * @file Set of prototypes that related to geometry.
 * @version 0.6.0
 */

/**
* @namespace advanced.geom
**/
new Namespace("advanced.geom").use(function() {
    var ns = this;
    this.imported();
    
     /** 
     * Pair of x and y.
     * @class Point
     * @param {number} x
     * @param {number} y
     */
    proto(function Point() {
        def(function initialize(x, y) {
            this.x = x;
            this.y = y;
        });
        
        /** 
        * add other points
        * @method add
        * @memberOf Point#
        * @param p {Point} 
        */
        def(function add(p) {
            return new ns.Point(this.x + p.x, this.y + p.y);
        });
        
        /** 
        * Returns the clone of Point.
        * @method clone
        * @memberOf Point#
        * @returns {Point} 
        */
        def(function clone() {
            return new ns.Point(this.x, this.y);
        });
        
        /** 
        * Returns the scalar value that represents distance between the two specified points.
        * @method distance
        * @memberOf Point#
        * @param p1 {Point}
        * @param p2 {Point} 
        * @returns {number} distance between the two points.
        */
        def(function distance(p1, p2) {
            var dx = p1.x - p2.x;
            var dy = p1.y - p2.y;
            return Math.abs(Math.sqrt(dx*dx + dy*dy));
        });
        
        /** 
        * Returns whether coordinates of this point equals to the coordinates of another specified point or not.
        * @method equals
        * @memberOf Point#
        * @param p {Point}
        * @returns {boolean} 
        */
        def(function equals(p) {
            return this.x == p.x && this.y == p.y;
        });
        
        /** 
        * add offset to this point.
        * @method offset
        * @memberOf Point#
        * @param dx {number} offset x
        * @param dy {number} offset y 
        */
        def(function offset(dx, dy) {
            this.x += dx;
            this.y += dy;
        });
        
        /** 
        * Subtracts the coordinates of another point from the coordinates of this point to create a new point.
        * @method sbutract
        * @memberOf Point#
        * @param p {Point} The point to be subtracted.
        * @returns {Point} The new point.
        */
        def(function subtract(p) {
            return new ns.Point(this.x - p.x, this.y - p.y);
        });
        
        /** 
        * Returns the length of the line segment from (0,0) to this point.
        * @method getLength
        * @memberOf Point#
        * @returns {number} length.
        */
        def(function getLength() {
            return Math.sqrt(this.x*this.x + this.y*this.y);
        });
        
        /** 
        * Determines a point between two specified points.
        * @method interpolate
        * @memberOf Point
        * @param {Point} p1 The first point.
        * @param {Point} p2 The second point.
        * @returns {Point} The new point.
        */
        $$.def(function interpolate(p1, p2, f) {
            var dx = p2.x - p1.x;
            var dy = p2.y - p1.y;
            var tx = p1.x + dx * (1-f);
            var ty = p1.y + dy * (1-f);
            return new ns.Point(tx, ty);
        });
        
        /** 
        * Converts a pair of polar coordinates to a Cartesian point coordinate.
        * @method polar
        * @memberOf Point
        * @param {number} length The length coordinate of the polar pair.
        * @param {number} radian The angle, in radians, of the polar pair.
        * @returns {Point} The Cartesian point.
        */
        $$.def(function polar(length, radian) {
            return new ns.Point(length * Math.cos(radian), length * Math.sin(radian));
        });
    });
    
    
     /** 
     * The Rectangle represents the geometric rectangle.
     * @class Rectangle
     * @param {number} x X coordinate of rectangle.
     * @param {number} y Y coordinate of rectangle.
     * @param {number} w Width of rectangle.
     * @param {number} h Height of rectangle.
     */
     proto(function Rectangle() {
         def(function initialize (x, y, w, h) {
             /** 
             * X coordinate of rectangle.
             * @member x
             * @memberOf Rectangle#
             **/
             this.x = x;
             /** 
             * Y coordinate of rectangle.
             * @member y
             * @memberOf Rectangle#
             **/
             this.y = y;
             /** 
             * Width of rectangle.
             * @member width
             * @memberOf Rectangle#
             **/
             this.width = w;
             /** 
             * Height of rectangle.
             * @member height
             * @memberOf Rectangle#
             **/
             this.height = h;
         });
        
        /**
        * Returns the clone of this Rectangle.
        * @method clone
        * @memberOf Rectangle#
        * @returns {Rectangle} 
        */
        def(function clone() {
            return new ns.Rectangle(this.x, this.y, this.width, this.height);
        });
        
        /**
        * Returns whether the specified point is contained within the rectangular region defined by this Rectangle.
        * @method clone
        * @memberOf Rectangle#
        * @param {number} x The x coordinate.
        * @param {number} y The y coordinate.
        * @returns {boolean}
        */
        def(function contains(x, y) {
            return (this.x < x && this.x + this.width > x) && (this.y < y && this.y + this.height > y);
        });
        
        /** 
        * Returns whether the specified point is contained within the rectangular region defined by this Rectangle.
        * @method containsPoint
        * @memberOf Rectangle#
        * @param p {Point} 
         * @returns {boolean}
        */
        def(function containsPoint(p) {
            return this.contains(p.x, p.y);
        });
        
        /** 
        * Returns whether the specified rectangle is contained within the rectangular region defined by this Rectangle.
        * @method containsPoint
        * @memberOf Rectangle#
        * @param rect {Rectangle} 
         * @returns {boolean}
        */
        def(function containsRect(rect) {
            return this.contains(rect.x, rect.y) && this.contains(rect.x + rect.width, rect.y + rect.height);
        });
        
        /**
        * Returns whether the specified rectangle equals to another specified rectangle.
        * @method equals
        * @memberOf Rectangle#
        * @param rect {Rectangle} 
        * @returns {boolean} 
        */
        def(function equals(rect) {
            return (this.x == rect.x && this.y == rect.y && this.width == rect.width && this.height == rect.height);
        });
        
        /** 
        * Inflate this rectangle
        * @method inflate
        * @memberOf Rectangle#
        * @param dx {Number} The offset x
        * @param dy {Number} The offset y
        */
        def(function inflate(dx, dy) {
            this.width += dx;
            this.height += dy;
        });
        
        /**
        * Inflate this rectangle
        * @method inflatePoint
        * @memberOf Rectangle#
        * @param p {Point} The offsets point.
        */
        def(function inflatePoint(p) {
            this.width += p.x;
            this.height += p.y;
        });
        
        /**
        * Returns the rectangle that represents this rectangle intersected the another rectangle.  (英語自身なし..)
        * @method intersection
        * @memberOf Rectangle#
        * @returns {Rectangle} The intersected region
        */
        def(function intersection(rect) {
            var r = new ns.Rectangle(0, 0, 0, 0);
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
        * Returns whether this rectangle intersected the another rectangle.
        * @method intersect
        * @memberOf Rectangle#
        * @returns {boolean}
        */
        def(function intersect(rect) {
            if (this.intersection)
                return true;
            else
                return false;
        });
        
        /**
        * Move this rectangle.
        * @method offset
        * @memberOF Rectangle#
        * @param {number} dx The offset x
        * @param {number} dy The offset y
        */
        def(function offset(dx, dy) {
            this.x += dx;
            this.y += dy;
        });
        
        /**
        * Move this rectangle.
        * @method offset
        * @memberOF Rectangle#
        * @param {Point} The offset point
        */
        def(function offsetPoint() {
            this.x += p.x;
            this.y += p.y;
        });
        
        /**
        * Union this rectangle and another rectangle.
        * @method union
        * @memberOF Rectangle#
        * @param {number} The offset x
        * @param {number} dy The offset y
        */
        def(function union(rect) {
            var intersection = this.intersection(rect);
            var r = new ns.Rectangle(0,0,0,0);
            r.x = Math.min(this.x, rect.x);
            r.y = Math.min(this.y, rect.y);
            r.width = this.width + rect.width - intersection.width;
            r.height = this.height + rect.height - intersection.height;
            return r;
        });
        
        /**
        * Return the bottom coordinate of this rectangle.
        * @method getBottom
        * @memberOf Rectangle#
        * @returns {number} 
        */
        def(function getBottom() {
            return this.y + this.height;
        });
        
        /**
        * Return the bottom right coordinate point of this rectangle.
        * @method getBottomRight
        * @memberOf Rectangle#
        * @returns {Point} 
        */
        def(function getBottomRight() {
            return new ns.Point(this.getRight(), this.getBottom());
        });
        
        /**
        * Return the right coordinate of this rectangle.
        * @method getRight
        * @memberOf Rectangle#
        * @returns {number} 
        */
        def(function getRight() {
            return this.x + this.width;
        });
        
        /**
        * Return the size of this rectangle.
        * @method getSize
        * @memberOf Rectangle#
        * @returns {Point} This point's x represent the width of this rectangle, y represent height of the this rectangle.
        */
        def(function getSize() {
            return new ns.Point(this.width, this.height);
        });
        
        /**
        * Return the top left coordinate point of this rectangle.
        * @method getTopLeft
        * @memberOf Rectangle#
        * @returns {Point} 
        */
        def(function getTopLeft() {
            return new ns.Point(this.x, this.y);
        });
     });
     
     /** 
     * 3 x 3 Matrix
     * @class Matrix
     * @param {number} [a=1]
     * @param {number} [b=0]
     * @param {number} [c=0]
     * @param {number} [d=1]
     * @param {number} [tx=0]
     * @param {number} [ty=0]
     */
     proto(function Matrix() {
         def(function initialize (a, b, c, d, tx, ty) {
            if (a == undefined) a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0;
            else if (b == undefined) b = 0, c = 0, d = 1, tx = 0, ty = 0;
            else if (c == undefined) c = 0, d = 1, tx = 0, ty = 0;
            else if (d == undefined) d = 1, tx = 0, ty = 0;
            else if (tx == undefined) tx = 0, ty = 0;
            else if (ty == undefined) ty = 0;
             this.a = a;
             this.b = b;
             this.c = c;
             this.d = d;
             this.tx = tx;
             this.ty = ty;
         });
         
         /**
         * Return the clone of this matrix.
         * @method clone 
         * @memberOf Matrix#
         * @returns {Matrix} The new Matrix.
         */
         def(function clone() {
             return new ns.Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
         });
         
         /**
         * Multiply this matrix to the another matrix.
         * @method concat
         * @memberOf Matrix#
         */
         def(function concat(m, _v) {
             var a = this.a, b = this.b, c = this.c, d = this.d, tx = this.tx, ty = this.ty;    
             this.a = m.a * a + m.b * c;
             this.b = m.a * b + m.b * d;
             this.tx = m.a * tx + m.b * ty + m.tx;
             
             this.c = m.c * a + m.d * c;
             this.d = m.c * b + m.d * d;
             this.ty = m.c * tx + m.d * ty + m.ty;
//             if (_v) console.log(m.c, tx, m.d, ty, m.ty);
         });
         
         /**
         * Set to the identity matrix.
         * @method identity
         * @memberOf Matrix#
         */
         def(function identity() {
             this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
         });
         
         /**
         * Rotate this matrix.
         * @method rotate
         * @memberOf Matrix#
        * @param {number} radian
         */
         def(function rotate(radian) {
             var rot = new ns.Matrix(0, 0, 0, 0, 0, 0);
             var s = Math.sin(radian);
             var c = Math.cos(radian);
            rot.a = c;
            rot.b = s;
            rot.c = -s;
            rot.d = c;
            this.concat(rot);
         });
         
         /**
         * Scale this matrix.
         * @method scale
         * @memberOf Matrix#
        * @param {number} scl
         */
         def(function scale(scl) {
             var s = new ns.Matrix(scl, 0, 0, scl, 0, 0);
            this.concat(s);
         });
         
         /**
         * Translate this matrix.
         * @method translate
         * @memberOf Matrix#
         */
         def(function translate(dx, dy) {
             this.tx += dx;
            this.ty += dy;
         });
     });
     
});
