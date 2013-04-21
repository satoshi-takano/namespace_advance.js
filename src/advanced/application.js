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
* @file Define set of prototypes related to the application.
* @version 0.6.0
*/

/** 
* @namespace advanced.application
*/
new Namespace("advanced.application").require(["advanced.events", "advanced.platform"], function() {
    this.use(function() {
        console.log('imported ', this.nsName)
        
        var ns = this;

         /** 
         * The Application manages the pointing device's position.
         * @class Application
         * @augments EventDispatcher
         */
        singleton(function Application() {
            var nse = new Namespace("advanced.events");
            ex(nse.EventDispatcher);

            init(function() {
                var self = this;
                /** 
                * The pointing device's x position on the window.
                * @member {number} mouseX
                * @memberOf Application#
                * @default 0
                */
                this.mouseX = 0;
                
                /** 
                * The pointing device's y position on the window.
                * @member {number} mouseY
                * @memberOf Application#
                * @default 0
                */
                this.mouseY = 0;
                
                /** 
                * The pointing device's x position on the window.
                * @member {UserAgent} userAgent
                * @memberOf Application#
                */
                this.userAgent = new (new Namespace("advanced.platform")).UserAgent();

                var util = new (new Namespace("advanced.core")).Utilitie();
                var isIE = this.userAgent.isIE();
                var app = this;
                this.canTrackMouse = false;
                util.listen(document, isIE ? "onmousemove" : "mousemove", function(mouseMove) {
                    if (!isIE) {
                        app.mouseX = mouseMove.clientX;
                        app.mouseY = mouseMove.clientY;
                        if (document.body)    { this.mouseY +=  document.body.scrollTop;}
                    } else {
                        app.mouseX = mouseMove.clientX;
                        app.mouseY = mouseMove.clientY + document.documentElement.scrollTop;
                    }
                    if (app.canTrackMouse == false) app.canTrackMouse = true;
                });

            });
        });
        
    })
})
