var hoot = require('../');
var cluster = require('cluster');
var path = require('path');

describe('hoot node module', function () {

  it('should work if not in the cluster', function (done) {
    hoot.on('test', function(data) {
      data.should.have.property('arg', 3);
      done();
    });
    hoot.send('test', { arg: 3 });
  });

  it('should notify all workers in the cluster', function (done) {
    var workerCount = 5,
      messagesReceived = 0,
      worker;

    // make sure we receive as many messages as we have workers
    function confirmationMessage(data) {
      data.should.have.property('arg', 123);
      if (++messagesReceived === workerCount) {
        done();
      }
    }

    cluster.setupMaster({
      exec: path.join(__dirname, 'fixtures/worker.js')
    });
    // start workers
    for(var i = 0; i < workerCount; i++) {
      worker = cluster.fork();
      hoot.registerWorker(worker);
      worker.on('message', confirmationMessage);
    }
    // start sender
    hoot.registerWorker(cluster.fork({
      sender: 1
    }));
  });

});
