new Namespace(namespace_lib_ui).using(function() {
	var ns = this;
	var nsd = new Namespace(namespace_lib_display);
	
	clas(function Label() {
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