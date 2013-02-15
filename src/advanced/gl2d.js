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
* @private
* @deprecated
*/ 

new Namespace("advanced.gl2d").use(function() {
	console.log('imported ', this.nsName)
	
	var namespace = this;
	var gl;
	
	/**
	* @class GLContext
	**/
	proto(function Stage() {
		init(function(canvasElement) {
			this._backgroundColor = [0, 0, 0, 1];
			
			gl = this.gl = canvasElement.getContext("webgl") || canvasElement.getContext("experimental-webgl");
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
			gl.viewport(0, 0, canvasElement.width, canvasElement.height);
			gl.clearColor(this._backgroundColor[0], this._backgroundColor[1], this._backgroundColor[2], 1);
			gl.clear(gl.COLOR_BUFFER_BIT);
		})
		
		getter("backgroundColor", function() {
			return this._backgroundColor;
		})
		setter("backgroundColor", function(vec4) {
			this._backgroundColor = vec4;
		})
	})
	
	/**
	* @class Program
	**/
	proto(function Program() {
		init(function() {
			this._program = gl.createProgram();
		})
	})
	
	/**
	* @class Shader
	**/
	proto(function Shader() {
		init(function(src) {
			
		})
	})
	
	
	/**
	* @class DisplayObject
	**/
	proto(function DisplayObject() {
		init(function() {
			this._program = new namespace.Program();
		})
	})
	
	
})