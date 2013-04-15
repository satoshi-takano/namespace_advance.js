if (this['window'] !== this) {
	var assert = require("assert");
}

before(function(done) {
    Namespace.jsPath = "../src";
    new Namespace("load").require(["advanced.core"], function() {
        done();
    });
})

describe('Test of notifications', function(){

    it('Validation of the notification object', function(){
        var userData = "This is an user data";
        var notif = new advanced.core.Notification("foo", userData);
        assert.equal(notif.getName(), "foo");
        assert.equal(notif.getUserData(), userData);
    })
})
