var hoot = require('../..');

if (process.env.sender) {

    hoot.send('test', { arg: 123 });
    process.nextTick(function() {
      process.exit();
    });

} else {

  hoot.on('test', function(data) {
    // got the broadcasted hoot message - let the test know
    process.send(data);
    process.nextTick(function() {
      process.exit();
    });
  });

}
