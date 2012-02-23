new Namespace(namespace_lib_app).using(function() {
	var ns = this;
		
	 /** 
	 * accessing a Applciation object
	 * @class 
	 */
	singleton(function Application() {
		var nse = new Namespace(namespace_lib_events);
		ex(nse.EventDispatcher);
		
		init(function() {
			var self = this;
			this.mouseX = 0;
			this.mouseY = 0;
			this.userAgent = new Namespace(namespace_lib_core).UserAgent.gen();
			
			var nscore = (new Namespace(namespace_lib_core));
			var util = nscore.Utilitie.gen();
			var isIE = this.userAgent.isIE();
			util.listen(document, isIE ? "onmousemove" : "mousemove", nscore.Performer.gen(this, function(mouseMove) {
				if (!isIE) {
					this.mouseX = mouseMove.clientX;
					this.mouseY = mouseMove.clientY;
					if (document.body)	{ this.mouseY +=  document.body.scrollTop;}
				} else {
					this.mouseX = mouseMove.clientX;
					this.mouseY = mouseMove.clientY + document.documentElement.scrollTop;
				}
			}));
			
		});
	});

});