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
* @file Define set of prototypes related to the networking.
* @version 0.6.0
*/

/** 
* @namespace advanced.net
*/
new Namespace("advanced.net").require(["advanced.events"], function() {
    this.use(function() {
        console.log('imported ', this.nsName)

        var ns = this;

        /** 
        * The URL object represents the URL.
        * @class URL
        * @param {string} url The URL that represented in string.
        */
        proto(function URL() {
            def(function initialize(url) {
                /** 
                * The URL that represented in string.
                * @member {string} url
                * @memberOf URL#
                */
                this.url = url;
                /** 
                * Scheme of this URL.
                * @member {string} scheme
                * @memberOf URL#
                * @default ""
                */
                this.scheme = 
                /** 
                * Port of this URL.
                * @member {string} port
                * @memberOf URL#
                * @default ""
                */
                this.port = 
                /** 
                * User of this URL.
                * @member {string} user
                * @memberOf URL#
                * @default ""
                */
                this.user = 
                /** 
                * Pass of this URL.
                * @member {string} pass
                * @memberOf URL#
                * @default ""
                */
                this.pass = 
                /** 
                * Path of this URL.
                * @member {string} path
                * @memberOf URL#
                * @default ""
                */
                this.path = 
                /** 
                * Query of this URL.
                * @member {string} query
                * @memberOf URL#
                * @default ""
                */
                this.query = 
                /** 
                * Fragment of this URL.
                * @member {string} fragment
                * @memberOf URL#
                * @default ""
                */
                this.fragment = "";
                this.generate();
            });

            /** 
            * @private
            */
            def(function generate() {
                var r = ns.URL.reg.exec(this.url);
                if (r) {
                    var value = "";
                    var regex = new RegExp("(.*?)=(.*?)$", "g");
                    for (var f in ns.URL.fields) {
                        value = r[ns.URL.fields[f]];
                        if (value) {
                            if (f == "query") {
                                var kvp = regex.exec(value);
                                value = {};
                                value[kvp[1]] = kvp[2];
                            }
                            this[f] = value;
                        }
                    }
                }
            });

            $$.reg = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?([^#]*)/;
            $$.fields = {
                    "scheme": 2,
                    "host": 6,
                    "port": 7,
                    "user": 4,
                    "pass": 5,
                    "path": 8,
                    "query": 9,
                    "fragment": 10
            };

        });

        /** 
        * The URLRequest object represents request.
        * @class URLRequest
        * @param {String} urlString
        */
        proto(function URLRequest() {
            def(function initialize (urlString) {
                /** 
                * URL.
                * @member {string} url
                * @memberOf URLRequest#
                */
                this.url = urlString;
                /** 
                * The HTTP method.
                * @member {string} httpMethod
                * @memberOf URLRequest#
                * @default "GET"
                */
                this.httpMethod = "GET";
                /** 
                * The HTTP header.
                * @member {object} httpHeader
                * @memberOf URLRequest#
                * @default {}
                */
                this.httpHeader = {};
                /** 
                * The HTTP body.
                * @member {string} httpBody
                * @memberOf URLRequest#
                * @default null
                */
                this.httpBody = null;

                this.httpHeader.contentType = "application/x-www-form-urlencoded;charset=UTF-8";
            });
        });


        /** 
        * 
        * @class URLLoader
        * @augments EventDispatcher
        */
        proto(function URLLoader() {
            var nse = new Namespace("advanced.events");

            ex(nse.EventDispatcher);

            def(function initialize () {
                this.currentXHR = null;
                /**
                * The fetched data.
                * @member {object} data
                * @memberOf URLLoader#
                * @default null
                **/
                this.data = null;

                var self =  this;
                this.readyStateCallback = function(e) {
                    if (self.currentXHR.readyState == ns.URLLoader.DONE) {
                        self.data = self.currentXHR.responseText;
                        self.dispatchEvent(new nse.FLEvent(nse.FLEvent.COMPLETE, self, e || null));
                    }
                }
            });

            /**
            * Start HTTP connecting asynchronous.
            * @method load
            * @memberOf URLLoader#
            * @param req {URLRequest} The HTTP request.
            */
            def(function load(req) {
                var xhr = this.currentXHR = this.generateXHR();
                xhr.onreadystatechange = this.readyStateCallback;
                xhr.open(req.httpMethod, req.url, true, null /* password */);
                xhr.setRequestHeader("Content-type", req.httpHeader.contentType);
                xhr.send(req.httpBody);
            });

            def(function generateXHR() {
                var xhr;
                if (global.XMLHttpRequest != undefined) {
                    xhr = new XMLHttpRequest();
                } else if (global.ActiveXObject){
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                return xhr;
            });

            $$.UNSET = 0;
            $$.OPENED = 1;
            $$.HEADERS_RECEIVED = 2;
            $$.LOADING = 3;
            $$.DONE = 4;
        });
        
    })
})
