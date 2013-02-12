window.onload = function() {

	

	test('euqation', 2, function() {
		strictEqual(new Namespace("_test.namespace.js"), new Namespace("_test.namespace.js"), 'new Namespace("_test.namespace.js") is equal to new Namespace("namespace.test")')
		strictEqual(new Namespace("_test.namespace.js"), window._test.namespace.js, 'new Namespace("_test.namespace.js") is equal to window._test.namespace.js')
 	});

	test('prototype definition', function() {
		new Namespace("_test.namespace.js").use(function() {
			proto(function Test() {
				init(function(name) {
					this.name = name;
				})
				def(function returnTrue() {return true;})
				def(function returnFalse() {return false;})

				$$.def(function classMethod() {
					return "This is class method of _test.namespace.js.Test";
				})
				$$.classVar = "I'm defined"
			})
		})


		ok(new Namespace("_test.namespace.js").Test != undefined, "_test.namespace.js.Test is defined");
		equal(new _test.namespace.js.Test('Test instance').name, 'Test instance', "new _test.namespace.js.Test('test instance').name is equal to 'test instance'");
		strictEqual(new _test.namespace.js.Test('Test instance').returnTrue(), true, "Test#returnTrue() returns true");
		strictEqual(new _test.namespace.js.Test('Test instance').returnFalse(), false, "Test#returnFalse() returns false");
		equal(_test.namespace.js.Test.classMethod(), "This is class method of _test.namespace.js.Test", "_test.namespace.js.Test.classMethod() says " + _test.namespace.js.Test.classMethod());
		equal(_test.namespace.js.Test.classVar, "I'm defined", "_test.namespace.js.Test.classVar says " + _test.namespace.js.Test.classVar);
	})

	test('extends', function() {
		new Namespace("_test.namespace.js").use(function() {
			proto(function ExTest() {
				ex(_test.namespace.js.Test)

				init(function(name) {
					this.$super(name);
				})

				def(function returnTrue() {
					return this.$super();
				})
			})
		})

		equal(new _test.namespace.js.ExTest('ExTest instance').name, 'ExTest instance', "new _test.namespace.js.ExTest('ExTest instance').name is equal to 'ExTest instance'");
		strictEqual(new _test.namespace.js.ExTest('Test instance').returnTrue(), true, "ExTest#returnTrue() returns true");
		strictEqual(new _test.namespace.js.ExTest('Test instance').returnFalse(), false, "ExTest#returnFalse() returns false");
	})

	test("asynchronous requireing other Namespace", function() {
		Namespace.jsPath = "."
		new Namespace("_test.namespace.js").require(["other_namespace"], function(){
			start();
			ok(new Namespace("other_namespace").OtherTest != undefined, 'new Namespace("other_namespace").OtherTest is defined');
			ok(new Namespace("class1.class2.other_namespace").OtherTest != undefined, 'new Namespace("class1.class2.other_namespace").OtherTest is defined');
			ok(new Namespace("class1.class2.other_namespace").UndefOtherTest == undefined, 'new Namespace("class1.class2.other_namespace").UndefOtherTest is undefined');
		})
		stop();
	})
}