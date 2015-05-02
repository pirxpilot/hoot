var debug = require('debug')('hoot');

// simple interworker communication

// this is only set on
var cluster;

function broadcast(data) {
  debug('Broadcasting %j', data);
  Object.keys(cluster.workers).forEach(function(pid) {
    cluster.workers[pid].send(data);
  });
}

// cluster should use this

function registerCluster(_cluster) {
  cluster = _cluster;
}

// workers should use these

function registerWorker(worker) {
  worker.on('message', function(data) {
    if (data._hoot) {
      broadcast(data);
    }
  });
}

// when in the cluster

function sendInCluster(msg, data) {
  debug('Worker sending message %s', msg);
  process.send({
    _hoot: true,
    msg: msg,
    data: data
  });
}

function onInCluster(msg, fn) {
  process.on('message', function(data) {
    if (data._hoot && data.msg === msg) {
      debug('Worker received message %s', data.msg);
      fn(data.data);
    }
  });
}

// fallback when process.send in not defined

var listeners = Object.create(null);

function sendLocal(msg, data) {
  debug('Worker sending message %s', msg);
  var listener = listeners[msg];
  if (listener) {
    debug('Worker received message %s', msg);
    process.nextTick(listener.bind(null, data));
  }
}

function onLocal(msg, fn) {
  listeners[msg] = fn;
}

var runningInCluster = typeof process.send === 'function';

module.exports = {
  registerCluster: registerCluster,
  registerWorker: registerWorker,
  send: runningInCluster ? sendInCluster : sendLocal,
  on: runningInCluster ? onInCluster : onLocal
};
