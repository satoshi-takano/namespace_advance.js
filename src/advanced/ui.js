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
new Namespace("advanced.ui").use(function() {
    console.log('imported ', this.nsName)
    
    var ns = this;
    var nsd = new Namespace("advanced.display");
    
    proto(function Label() {
        ex(nsd.DisplayObject);
        
        init(function(textElement) {
            ns.Label.superClass.initialize.call(this, textElement);
            this.hasInnerHTML = true;
            if (textElement.innerHTML == undefined)
                this.hasInnerHTML = false;
            this.text;
            if(this.hasInnerHTML)
                this.text = textElement.innerHTML;
            else
                this.text = textElement.textContent;
        });
        
        def(function rendering() {
            var box = document.createElement("div");
                
            box.style.position = "absolute";
            var clone = this.domElement.cloneNode(true);
            box.appendChild(clone);
            document.body.appendChild(box);
            var t = this.text;
            clone.style.fontSize = this.domElement.style.fontSize;

            this.setCloneText(t, clone);
            
            box.style.width = this.targetWidth + "px";

            while (box.offsetHeight > this.targetHeight) {
                if (t.length == 3) {
                    this.setCloneText(t.substring(0, 1), clone);
                    return;
                }
                
                t = t.substr(0, t.length-2) + "…";
                this.setCloneText(t, clone);
            }
            
            box.style.width = "";
            while (box.offsetWidth > this.targetWidth) {
                if (t.length == 4) {
                    this.setCloneText(t.substring(0, 1), clone);
                    return;
                }
                t = t.substr(0, t.length-4) + "...";
                this.setCloneText(t, clone);
            }

            document.body.removeChild(box)
            this.setText(t);
        });
        
        def(function setText(val) {
            if (this.hasInnerHTML)
                this.domElement.innerHTML = val;
            else
                this.domElement.textContent = val;
        });
        
        def(function setCloneText(val, clone) {
            if (clone.innerHTML == undefined)
                clone.textContent = val;
            else
                clone.innerHTML = val;
        });
        
        def(function getText() {
            if (this.hasInnerHTML) 
                return this.domElement.innerHTML;
            else
                return this.domElement.textContent;
        });
        
        def(function setWidth(val) {
            this.targetWidth = val;
        });
        
        def(function setHeight(val) {
            this.targetHeight = val;
        });
    });
});