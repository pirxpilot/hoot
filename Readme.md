[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]

# hoot

Inter-worker message-based communication in the node cluster.
Based on [this gist](https://gist.github.com/jpoehls/2232358).

## Install

```sh
$ npm install --save hoot
```

## Usage

```js
var hoot = require('hoot');

// in cluster master when creating workers
worker = cluster.fork();
hoot.registerWorker(worker);

// in worker
hoot.send('rainbow', { colors: 7 });

hoot.on('rainbow', function(data) {
  // all workers will see that
  console.log('Rainbow has ', data.colors, ' colors');
});
```

## API

### `hoot.send(message, data)`

Any worker can call `send` to broadcast `message` to all running workers.
`data` can be passed along the message to the `listener`

### `hoot.on(message, listener)`

Worker registers listener function for each `message` separately.
`listener` receives message `data` as its argument.

### `hoot.registerWorker(worker)`

Cluster master needs to call `registerWorker` for all workers that participate in message exchange.

## License

MIT © [Damian Krzeminski](https://pirxpilot.me)

[npm-image]: https://img.shields.io/npm/v/hoot.svg
[npm-url]: https://npmjs.org/package/hoot

[travis-url]: https://travis-ci.org/pirxpilot/hoot
[travis-image]: https://img.shields.io/travis/pirxpilot/hoot.svg

[gemnasium-image]: https://img.shields.io/gemnasium/pirxpilot/hoot.svg
[gemnasium-url]: https://gemnasium.com/pirxpilot/hoot
