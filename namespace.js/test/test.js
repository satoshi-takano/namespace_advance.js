if (this['window'] !== this) {
	var assert = require("assert");
}

describe('new Namespace', function(){
    it('Check uniqueness of the Namespace', function(){
		assert.equal(new Namespace("test"), new Namespace("test"));
		assert.equal(new Namespace("test"), global.test);
    })
})

describe("Prototype definition", function() {
	new Namespace("test.prototypedef").use(function() {
		proto(function Test() {
			init(function(name) {
				this.name = name;
			})

            def(function thisIsFirstDefinedMethod() {
                return "This is first defined method";
            })
            
			def(function returnTrue() {return true;})
			def(function returnFalse() {return false;})

			$$.def(function classMethod() {
				return "This is class method of test.prototypedef.Test";
			})
			$$.classVar = "I'm defined"
		})
	})

	it("new test.prototypedef.Test('test instance').name is equal to 'test instance'", function() {
		assert.equal(new test.prototypedef.Test('Test instance').name, 'Test instance');
	})
	it("Test#returnTrue() returns true", function() {
		assert.equal(new test.prototypedef.Test('Test instance').returnTrue(), true)
	})
	it("Test#returnFalse() returns false", function() {
		assert.equal(new test.prototypedef.Test('Test instance').returnFalse(), false)
	})
	it("test.prototypedef.Test.classMethod() says " + test.prototypedef.Test.classMethod(), function() {
		assert.equal(test.prototypedef.Test.classMethod(), "This is class method of test.prototypedef.Test")
	})
	it("test.prototypedef.Test.classVar says " + test.prototypedef.Test.classVar, function() {
		assert.equal(test.prototypedef.Test.classVar, "I'm defined")
	})


    var preReDefinedTest = test.prototypedef.Test;
    var preReDefinedTestInstance = new preReDefinedTest();
    
    new Namespace("test.prototypedef").use(function() {
		proto(function Test() {
			def(function thisIsSecondDefinedMethod() {
                return "This is second defined method";
            })
		})
	})
    
    it("modify the prototype that is already defined", function() {
        assert.equal(test.prototypedef.Test, preReDefinedTest);
        assert.equal(preReDefinedTestInstance.thisIsSecondDefinedMethod(), "This is second defined method");
    })
})


describe('Extends', function() {
	new Namespace("test.extends").use(function() {
		proto(function ExTest() {
			ex(test.prototypedef.Test)

			init(function(name) {
				this.$super(name);
			})

			def(function returnTrue() {
				return this.$super();
			})
		})
	})

	it("new test.extends.ExTest('ExTest instance').name is equal to 'ExTest instance'", function() {
		assert.equal(new test.extends.ExTest('ExTest instance').name, 'ExTest instance');
	})
	it("ExTest#returnTrue() returns true", function() {
		assert.equal(new test.extends.ExTest('Test instance').returnTrue(), true);
	})
	it("ExTest#returnFalse() returns false", function() {
		assert.equal(new test.extends.ExTest('Test instance').returnFalse(), false);
	})
})

if (this['window'] === this) {
	describe('Asynchronous requireing other Namespace', function() {
	Namespace.jsPath = "."
	
	it('Load an other namespace',function(done){
		new Namespace("test.asyncrequire").require(["other_namespace"], function(){
			assert.equal(new Namespace("other_namespace").OtherTest, other_namespace.OtherTest);
			assert.equal(new Namespace("class1.class2.other_namespace").OtherTest, class1.class2.other_namespace.OtherTest);
			done();
		})
	})

})
}

