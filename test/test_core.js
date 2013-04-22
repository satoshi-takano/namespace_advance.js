if (this['window'] !== this) {
	var assert = require('assert');
}

before(function(done) {
    Namespace.jsPath = '../src';
    new Namespace("load").require(['advanced.core'], function() {
        done();
    });
})

describe('Test of the Notification', function(){
    it('should have 2 properties', function(){
        var userData = 'This is an user data';
        var notif = new advanced.core.Notification('foo', userData);
        assert.equal(notif.getName(), 'foo');
        assert.equal(notif.getUserData(), userData);
    })

    it('should receive a notification', function() {
        var numReceivedNotifications = 0;
        
        var notif = new advanced.core.Notification('notifA');
        advanced.core.NotificationCenter.addObserver(this, function(n){
            numReceivedNotifications++;
        }, 'notifA');
        advanced.core.NotificationCenter.postNotification(notif);

        notif = new advanced.core.Notification('notifB');
        advanced.core.NotificationCenter.postNotification(notif);

        assert.equal(numReceivedNotifications, 1);
    })
})

describe('Test of the Range', function() {
    it('returns true when this contains an specified argument', function() {
        var outerRange = new advanced.core.Range(100, 110);
        var innerRange = new advanced.core.Range(101, 109);
        assert.equal(true, outerRange.contains(innerRange));

        innerRange = new advanced.core.Range(100, 110);
        assert.equal(true, outerRange.contains(innerRange));
    })

    it('returns false when this doesn\'t contain an specified argument', function() {
        var outerRange = new advanced.core.Range(100, 110);
        var innerRange = new advanced.core.Range(100, 111);
        assert.equal(false, outerRange.contains(innerRange));

        var innerRange = new advanced.core.Range(99, 110);
        assert.equal(false, outerRange.contains(innerRange));
    })

    it('should returns 150', function() {
        var source = new advanced.core.Range(10, 20);
        var destination = new advanced.core.Range(100, 200);
        assert.equal(150, source.remap(15, destination));
    })

    it('should returns 0.5', function() {
        var range = new advanced.core.Range(1.5, 2);
        assert.equal(0.5, range.length());
    })

    it('should returns 0.5', function() {
        var range = new advanced.core.Range(30, 60);
        assert.equal(0.5, range.ratio(30 + (60 - 30) * 0.5));
    })
})

describe('Test of the Operation', function(){
    var numCalled = 0;
    var q;
    
    it('shoud calls three operations', function() {
        q = new advanced.core.OperationQueue();
        
        q.push(new advanced.core.Operation(this, function() {
            numCalled++;
        }));
        q.push(new advanced.core.Operation(this, function() {
            numCalled++;
        }));
        q.push(new advanced.core.Operation(this, function() {
            numCalled++;
        }));

        q.execute();
        assert.equal(3, numCalled);
    })

    it('should calls two operations', function() {
        q.pop();
        q.execute();
        assert.equal(5, numCalled);
    })
})

describe('Test of the Recordable', function() {
    it('should be able to playback', function() {

        new Namespace("testofthecore").use(function() {
            proto(function RecordableTest() {
                def(function initialize() {
                    this.numCalled = 0;
                    
                    this.include(new advanced.core.Recordable());
                })

                def(function increment() {
                    this.rec();
                    this.numCalled++;
                })
            })
        })

        var test = new testofthecore.RecordableTest();
        test.increment();
        assert.equal(1, test.numCalled);
        test.playback();
        assert.equal(2, test.numCalled);
    })
})
