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
* @file Define set of prototypes related to the platform.
* @version 0.6.0
*/

/** 
* @namespace advanced.platform
*/
new Namespace("advanced.platform").use(function() {
    console.log('imported ', this.nsName)
    
    var ns = this;
    
        /** 
        * Managing the user agent.
        * @class UserAgent
        **/
        proto(function UserAgent() {
            def(function initialize() {
                this.ua = navigator.userAgent.toLowerCase();
            });
            /** 
            * Determine whether user's environment is Internet Explorer.
            * @method isIE
            * @memberOf UserAgent#
            * @returns {boolean}
            **/
            def(function isIE() {
                return this.ua.indexOf("msie") != -1;
            });
            /** 
            * Determine whether user's environment is Internet Explorer 6.
            * @method isIE6
            * @memberOf UserAgent#
            * @returns {boolean}
            **/
            def(function isIE6() {
                return this.ua.indexOf("msie 6") != -1;
            });
            /** 
            * Determine whether user's environment is Internet Explorer 7.
            * @method isIE7
            * @memberOf UserAgent#
            * @returns {boolean}
            **/
            def(function isIE7() {
                return this.ua.indexOf("msie 7") != -1;
            });
            /** 
            * Determine whether user's environment is Internet Explorer 8.
            * @method isIE8
            * @memberOf UserAgent#
            * @returns {boolean}
            **/
            def(function isIE8() {
                return this.ua.indexOf("msie 8") != -1;
            });
            /** 
            * Determine whether user's environment is FireFox.
            * @method isFireFox
            * @memberOf UserAgent#
            * @returns {boolean}
            **/
            def(function isFireFox() {
                return this.ua.indexOf("firefox") != -1;
            });
            /** 
            * Determine whether user's environment is Safari.
            * @method isSafari
            * @memberOf UserAgent#
            * @returns {boolean}
            **/
            def(function isSaferi() {
                return this.ua.indexOf("safari") == -1 || this.isChrome() ? false : true;
            });
            /** 
            * Determine whether user's environment is Chrome.
            * @method isChrome
            * @memberOf UserAgent#
            * @returns {boolean}
            **/
            def(function isChrome() {
                return this.ua.indexOf("chrome") != -1;
            });
            /** 
            * Determine whether user's environment is mobile device.
            * @method isMobile
            * @memberOf UserAgent#
            * @returns {boolean}
            **/
            def(function isMobile() {
                return (this.isiPhone() || this.isiPodTouch() || this.isAndroid());
            });
            /** 
            * Determine whether user's environment is iPhone.
            * @method isiPhone
            * @memberOf UserAgent#
            * @returns {boolean}
            **/
            def(function isiPhone() {
                return this.ua.indexOf("iphone") != -1;
            });
            /** 
            * Determine whether user's environment is iPad.
            * @method isiPad
            * @memberOf UserAgent#
            * @returns {boolean}
            **/
            def(function isiPad() {
                return this.ua.indexOf("ipad") != -1;
            });
            /** 
            * Determine whether user's environment is iPodTouch.
            * @method isiPodTouch
            * @memberOf UserAgent#
            * @returns {boolean}
            **/
            def(function isiPodTouch() {
                return this.ua.indexOf("ipod") != -1;
            });
            /** 
            * Determine whether user's environment is Android.
            * @method isAndroid
            * @memberOf UserAgent#
            * @returns {boolean}
            **/
            def(function isAndroid() {
                return this.ua.indexOf("android") != -1;
            });
        });

});
