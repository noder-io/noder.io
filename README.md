# Noder.io

[![Actual version published on NPM](https://badge.fury.io/js/noder.io.png)](https://www.npmjs.org/package/noder.io)
[![npm module downloads per month](http://img.shields.io/npm/dm/noder.io.svg)](https://www.npmjs.org/package/noder.io)


Noder.io provides a lightweight and flexible core to create a scalable API of a lib, a module, an application or a framework. Noder.io is inspired (among others) by _Angular_ and _Pimple_.

It is useful for __starting a project quickly__ with a __modular API__ ready to use.

Noder.io (and any object built on top of Noder.io) integrates:

  * [dependency injection](http://noder.io/guide/dependency-injection.html)
  * [constructors of services, factories and providers](http://noder.io/guide/services.html)
  * [lazy loading](http://noder.io/guide/lazy-loading.html)
  * [plugins system easy to use](http://noder.io/guide/plugins.html)

No dependencies, works on __Node.js__ and in the __browser__ (only 7kb minified - 2kb gzipped).


## Quick start

See [quickstart](http://noder.io/guide/quickstart.html).


## Usage

Get common instance of `Noder`:

```js
var noder = require('noder.io');
```

Best practice, create an instance of `Noder` class for your project:

```js
// ./api/index.js
var Noder = require('noder.io').Noder;
var api   = new Noder();

// code body that constructs your API

module.exports = api;
```

or shortcut:

```js
// ./api/index.js
module.exports = require('noder.io').createNoder();
```

Use your API in another file:

```js
var api = require('./api');

// load a plugin
api.use('pluginName');

// create an item in the container
api.$di.set('someItem', 'value of the item');

// ...
```


### Collection

Noder.io provides a class to handle a collection of items.

```js
// create a collection
var items = noder.createCollection();

items.set('keyName', 'key value');

// keyName value
console.log(items.get('keyName'));

// get all items
var all = items.getAll();

// true
console.log(items instanceof noder.Collection);
```

See [collection](http://noder.io/guide/collection.html).


### Dependency Injection

See [dependency injection](http://noder.io/guide/dependency-injection.html).


### Lazy loading

`noder.$require` method provides a lazy `require()`:

```js
// define the property without loading the mongoose module
noder.$require('mongoose');

// false
console.log(noder.$require.isLoaded('mongoose'));

// lazy loading
var mongoose = noder.mongoose;

// true
console.log(noder.$require.isLoaded('mongoose'));

// true
console.log(noder.mongoose === require('mongoose'));
```

Aliases:

```js
noder.$require('promise', 'bluebird');

// true
console.log(noder.promise === require('bluebird'));
```

Custom loader:

```js
// factory: promisify the "fs" module
noder.$require('fs', function() {
  return noder.promise.promisifyAll(require('fs'));
});

fs.readFileAsync('./any-file.js')
  .then(function(contents) {
    console.log(contents);
  })
  .catch(function(err) {
    console.error(err);
  })
;
```

See [lazy loading](http://noder.io/guide/lazy-loading.html).


### Plugins

Noder.io provides a plugin system to make a package works as a plugin for Noder.io and also as a standalone module or library.

Example of a Noder plugin:

```js
/**
 * Initialization for use as a standalone module.
 * @return {Noder} New `Noder` instance
 */
module.exports = function blog() {

  var Noder = require('noder.io').Noder;
  var noder = new Noder();

  // or use the shortcut:
  // var noder = require('noder.io').createNoder();

  return module.exports.__noder(noder);
};

/**
 * Init `blog` plugin.
 * @param  {Noder} noder  `Noder` instance
 * @return {Noder}        Current `Noder` instance
 */
module.exports.__noder = function blogPlugin(noder) {

  // create config object only if not exists
  noder.$di.addOnce('config', {}, true);

  // sub-modules of blogPlugin
  // that add features to the instance of Noder
  noder.use(require('./api/article'));
  noder.use(require('./api/comment'));
  noder.use(require('./api/admin'));

  // Always return the instance of Noder to allow chaining
  return noder;
};
```

See [plugins](http://noder.io/guide/plugins.html).


## Unit Tests

Noder.io [is fully tested](https://github.com/noder-io/noder.io/tree/master/test/src) with [Unit.js](http://unitjs.com) and Mocha.


## License

[MIT](https://github.com/noder-io/noder.io/blob/master/LICENSE) (c) 2013, Nicolas Tallefourtane.


## Author

| [![Nicolas Tallefourtane - Nicolab.net](http://www.gravatar.com/avatar/d7dd0f4769f3aa48a3ecb308f0b457fc?s=64)](http://nicolab.net) |
|---|
| [Nicolas Talle](http://nicolab.net) |
| [![Make a donation via Paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PGRH4ZXP36GUC) |
