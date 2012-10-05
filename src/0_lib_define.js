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
 * @fileOverview 各名前空間が(String型で)宣言されています.
 * 別のライブラリなどの名前空間と衝突する場合はこのファイル内の定義を書き換えます.
 */
 
/**
* @description  グローバルオブジェクト.<br/>
* Web Browser なら window が入る.
*/
var global = window;

var namespace_lib_core = "jp.example"; // enter your reversed domain.
var namespace_lib_app = namespace_lib_core + ".application";
var namespace_lib_geom = namespace_lib_core + ".geom";
var namespace_lib_events = namespace_lib_core + ".events";
var namespace_lib_tween = namespace_lib_core + ".tween";
var namespace_lib_net = namespace_lib_core + ".net";
var namespace_lib_display = namespace_lib_core + ".display";
var namespace_lib_ui = namespace_lib_core + ".ui";
var namespace_lib_math = namespace_lib_core + ".math";
var namespace_lib_canvas = namespace_lib_core + ".html5.canvas";
var namespace_lib_platform = namespace_lib_core + ".platform";