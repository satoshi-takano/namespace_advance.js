new Namespace("class1.class2.other_namespace").use(function() {
	console.log("imported : " + this.nsName)
	proto(function OtherTest() {

	})
})