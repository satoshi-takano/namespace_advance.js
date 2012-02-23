new Namespace(namespace_lib_display).using(function() {
	var ns = this;
	var nsc = new Namespace(namespace_lib_core);
	var nse = new Namespace(namespace_lib_events);
	var nsg = new Namespace(namespace_lib_geom);
	var app = (new Namespace(namespace_lib_app)).Application.getInstance();
	
	/** 
	* creating a DisplayObject
	* @class 
	*/
	clas(function DisplayObject() {
		ex(nse.EventDispatcher);
		
		init(function(domElement) {
			this.domElement = domElement;
			this.parent = null;
			this.alpha = 1;
		});
		
		def(function getX() {
			return this.domElement.style.left.replace("px", "") || 0;
		});
		
		def(function setX(val) {
			this.domElement.style.marginLeft = val + "px";
		});
		
		def(function getY() {
			return this.domElement.style.top.replace("px", "") || 0;
		});
		
		def(function setY(val) {
			this.domElement.style.top = val + "px";
		});
		
		def(function getWidth() {
			return this.domElement.offsetWidth;
		});
		
		def(function setWidth(val) {
			this.domElement.style.width = val + "px";
		});
		
		def(function getHeight() {
			return this.domElement.offsetHeight;
		});
		
		def(function setHeight(val) {
			this.domElement.style.height = val + "px";
		});
		
		def(function getMouseX() {
			return app.mouseX - this.getGlobalX();
		});
		
		def(function getMouseY() {
			return app.mouseX.mouseY - this.getGlobalY();	
		});
		
		def(function getGlobalX() {
			var tmpX = 0;
			tmpX = this.domElement.offsetLeft;
			var pa = this.domElement.offsetParent;
			while (pa) {
				tmpX += pa.offsetLeft;
				pa = pa.offsetParent;
			}
			return tmpX;
		});
		
		def(function getGlobalY() {
			var tmpY = 0;
			tmpY = this.domElement.offsetTop;
			var pa = this.domElement.offsetParent;
			while (pa) {
				tmpY += pa.offsetTop;
				pa = pa.offsetParent;
			}
			return tmpY;
		});
		
		def(function getBounds(targetCoordinateSpace) {
			var targetXAtGlobal = targetCoordinateSpace.getGlobalX();
	 		var targetYAtGlobal = targetCoordinateSpace.getGlobalY();
	 		var thisXAtGlobal = this.getGlobalX();
	 		var thisYAtGlobal = this.getGlobalY();
	 		return nsg.Rectangle.gen(thisXAtGlobal - targetXAtGlobal, thisYAtGlobal  -targetXAtGlobal);
		});
		
		def(function getRect(targetCoordinateSpace) {
			return this.getBounds(targetCoordinateSpace);
		});
		
		def(function globalToLocal(globalP) {
			return new nsg.Point(this.x + globalP.x, this.y + globalP.y);
		});
		
		def(function paint() {
			var style = this.domElement.style;
			var ua = app.userAgent;
			if (ua.isIE()) { style.filter = "alpha(opacity=" + this.alpha * 100 + ")"; }
			else style.opacity = this.alpha.toString();
		});
		
		def(function rendering() {
			this.paint();
		});
		
		def(function removeFromSuperview() {
			this.domElement.parentNode.removeChild(this.de);
		});
	});
	
	
	/** 
	* creating a InteractiveObject
	* @class 
	*/
	clas(function InteractiveObject() {
		ex(ns.DisplayObject);
		
		init(function(domElement) {
			this.domElement = domElement;
			this.setEvents();
		});
		
		def(function getUseHandCursor() {
			return this.domElement.style.cursor == "pointer";
		});
		
		def(function setUseHandCursor(val) {
			if (val) {
				this.domElement.style.cursor = "pointer";
			}
			else {
				this.domElement.style.cursor = "default";
			}
		});
		
		def(function setEvents() {
			var self = this;
			var g = nsc.Utilitie.gen();
			var isOvered = false;
			g.listen(this.domElement, nse.DOMMouseEvent.MOUSE_OVER, function(evt){
				if (isOvered == false) {
					isOvered = true;
					self.dispatchEvent(new nse.FLMouseEvent(nse.FLMouseEvent.ROLL_OVER, self));
				}
			});
			g.listen(this.domElement, nse.DOMMouseEvent.MOUSE_OUT, function(evt){
				if (isOvered) {
					var rect = new geom.Rectangle(self.getGlobalX(), self.getGlobalY(), self.getWidth(), self.getHeight());
					if (isOvered) {
						isOvered = false;
						self.dispatchEvent(new nse.FLMouseEvent(nse.FLMouseEvent.ROLL_OUT, self, evt));
					}
					// 1フレまつ
					/*
					new Wait(1, function() {
						if (!rect.contains(Application.mouseX, Application.mouseY)) {
							if (isOvered) {
								isOvered = false;
								self.dispatchEvent(new nse.FLMouseEvent(nse.FLMouseEvent.ROLL_OUT, self, evt));
							}
						}
					})*/
				}
			});
			g.listen(this.domElement, nse.DOMMouseEvent.MOUSE_OVER, function(evt){
				var mOver = new nse.FLMouseEvent(nse.FLMouseEvent.MOUSE_OVER, self, evt);
				mOver.target = evt.target || evt.srcElement;
				self.dispatchEvent(mOver);
			});
			g.listen(this.domElement, nse.DOMMouseEvent.MOUSE_OUT, function(evt){
				var mOut = new nse.FLMouseEvent(nse.FLMouseEvent.MOUSE_OUT, self, evt);
				mOut.target = evt.target || evt.srcElement;
				self.dispatchEvent(mOut);
			});
			g.listen(this.domElement, nse.DOMMouseEvent.CLICK, function(evt){
				var click = new nse.FLMouseEvent(nse.FLMouseEvent.CLICK, self, evt);
				click.target = evt.target || evt.srcElement;
				self.dispatchEvent(click);
			});
			g.listen(this.domElement, nse.DOMMouseEvent.MOUSE_DOWN, function(evt){
				var down = new nse.FLMouseEvent(nse.FLMouseEvent.MOUSE_DOWN, self, evt);
				down.target = evt.target || evt.srcElement;
				self.dispatchEvent(down);
			});
			g.listen(this.domElement, nse.DOMMouseEvent.MOUSE_UP, function(evt){
				var up = new nse.FLMouseEvent(nse.FLMouseEvent.MOUSE_UP, self, evt);
				up.target = evt.target || evt.srcElement;
				self.dispatchEvent(up);
			});
		});
		/*
		def(function paint() {
			var style = self.domElement.style;
			var ua = Application.userAgent;
			if (ua.isIE()) style.filter = "alpha(opacity=" + self.alpha * 100 + ")";
			else style.opacity = self.alpha.toString();
		});*/
	});

});