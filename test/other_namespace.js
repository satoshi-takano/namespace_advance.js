new Namespace("other_namespace").require(["class1.class2.other_namespace"], function() {
	console.log("imported : " + this.nsName)
	
	this.use(function() {

		proto(function OtherTest() {

		})

	})
})