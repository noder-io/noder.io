/**
 * This file is part of Noder.io.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code
 * or visit http://noder.io.
 *
 * @author Nicolas Tallefourtane <dev@nicolab.net>
 */

'use strict';

var Collection = require('./collection');

// modules loaded
var loaded = {};

/**
 * `Noder` constructor.
 *
 * The `Noder` instance is created when the first usage of `require('noder.io')`,
 * then the same object (reference) is returned by `require('noder.io')` in the next usages.
 *
 * @example
 *   // file: a.js
 *   var noder = require('noder.io');
 *
 *   // true
 *   console.log(typeof noder === 'object');
 *
 *   // true
 *   console.log(noder instanceof noder.Noder);
 *
 *   noder.$di.set('hello', '-> Hello from a.js file.');
 *
 *   // file: b.js
 *   var noder = require('noder.io');
 *
 *   // -> Hello from a.js file.
 *   console.log(noder.$di.get('hello'));
 *
 * @constructor
 *
 * @see Noder.Noder
 */
function Noder() {

  this.$di  = new Noder.prototype.$di();

  this.$di.addAll({
    '$api'       : this,
    '$di'        : this.$di,
    '$container' : this.$di._container,
    '$invoke'    : this.$wrap(this.$invoke),
    '$inject'    : this.$wrap(this.$inject),
    '$provider'  : this.$wrap(this.$provider),
    '$factory'   : this.$wrap(this.$factory),
    '$singleton' : this.$wrap(this.$singleton),
    '$apply'     : this.$wrap(this.$apply),
    '$wrap'      : this.$wrap(this.$wrap)
  });
}

/**
 * `Noder` constructor.
 * For creating a new instance of `Noder`.
 *
 * @example
 *   var api = new noder.Noder();
 *
 * @constructor
 * @type {function}
 */
Noder.prototype.Noder = Noder;

/**
 * IOC container.
 *
 * See [Collection API doc](collection.html).
 *
 * @example
 *   noser.$di.set('name', Nico);
 *
 *   var hello = noder.$di.apply(function() {
 *     return 'Hello ' + this.name;
 *   });
 *
 * @type {Collection}
 *
 * @see Noder.$invoke()
 * @see Noder.$inject()
 * @see Noder.$provider()
 * @see Noder.$factory()
 * @see Noder.$singleton()
 * @see Noder.$apply()
 * @see Noder.$wrap()
 */
Noder.prototype.$di = Collection;

/**
 * `Collection` constructor.
 * For creating a new instance of `Collection`.
 *
 * @example
 *   var collection = new noder.Collection();
 *
 *   collection.set('keyName', 'any value');
 *
 *   // any value
 *   console.log(collection.get('keyName'));
 *
 *
 * @constructor
 *
 * @param {object} [values] (Optional) values to add in the collection.
 * ```js
 * var collection = new noder.Collection({'foo': 'bar'});
 *
 * // display "bar"
 * console.log(collection.get('foo'));
 * ```
 *
 * @see Noder.createCollection()
 * @see Noder.Noder
 */
Noder.prototype.Collection = Collection;

/**
 * Create a collection container.
 *
 * @example
 *   var collection = noder.createCollection();
 *
 *   // true
 *   console.log(collection instanceof noder.Collection);
 *
 *   collection.set('keyName', 'any value');
 *
 *   // any value
 *   console.log(collection.get('keyName'));
 *
 * @param {object} [values] Optional values to add in the new collection.
 * ```js
 * var collection = noder.createCollection({'foo': 'bar'});
 *
 * // display "bar"
 * console.log(collection.get('foo'));
 * ```
 * @return {Collection} The new `Collection` instance
 *
 * @see Noder.Collection
 * @see Noder.createNoder()
 */
Noder.prototype.createCollection = function createCollection(values) {

  if(values) {
    return new this.Collection(values);
  }

  return new this.Collection();
};

/**
 * Create a new `Noder` instance.
 *
 * @example
 *   var api = noder.createNoder();
 *
 *   // true
 *   console.log(api instanceof noder.Noder);
 *
 * @return {Noder} The new `Noder` instance
 */
Noder.prototype.createNoder = function createNoder() {

  return new this.Noder();
};

/**
 * Use a noder plugin.
 * A plugin is initialized by the method `__noder()`.
 *
 * See also [plugins](/guide/plugins.html) in the guide.
 *
 * @example
 *   // example-plugin.js *
 *   module.exports.__noder = examplePlugin(noder, arg1, arg2) {
 *
 *     noder.$di.set('foo', arg1 + ' and ' + arg2);
 *
 *     return noder;
 *   };
 *
 *   // app.js
 *   var noder         = require('noder.io').createNoder();
 *   var examplePlugin = require('./example-plugin');
 *
 *   noder.use(examplePlugin, 'any value 1', 'any value 2');
 *
 *   // displays: 'any value 1 and any value 2'
 *   console.log(noder.$di.get('foo'));
 *
 * @param  {string|object|function} noderPlugin A noder plugin.
 *   If `noderPlugin` is:
 *
 *   * `string`: the plugin is loaded with `require`
 *   and called by passing the current instance of `noder` like
 *
 *   ```js
 *   require(noderPlugin).__noder(noder [, optional argument, ...]);
 *   ```
 *   * `object` or `function`: the method `__noder()` is called by passing
 *   the current instance of `noder` like
 *
 *   ```js
 *   noderPlugin.__noder(noder [, optional argument, ...]);
 *   ```
 *
 * @param {...mixed} [arguments] Zero, one or several arguments passed to plugin.
 *
 * @return {Noder} The current `Noder` instance.
 *
 * @throws {TypeError} If the plugin has not the method [__noder()](/guide/plugins.html).
 */
Noder.prototype.use = function use(noderPlugin) {

  var initPlugin = function(plugin, args) {

    if(typeof plugin.__noder != 'function') {
      throw new TypeError(
        'Argument #1 passed to Noder.use() is not a valid plugin for Noder.io.' +
        'A plugin must implement a method named `__noder()` that is used for ' +
        'initialization. Example: ' +
        '`module.exports.__noder = function MyPlugin(noder) {\n  ' +
        '// here, the bootstrap\n};`' +
        '\n\nAPI doc: http://noder.io/api/noder.html#use'
      );
    }

    plugin = plugin.__noder;

    args.length > 1 ?
      plugin.apply(null,
        Array.prototype.concat.apply(
          [this], Array.prototype.slice.call(args, 1)
        )
      )
    : plugin(this);

  }.bind(this);

  if(typeof noderPlugin == 'string') {

    initPlugin(require(noderPlugin), arguments);

  }else{

    initPlugin(noderPlugin, arguments);
  }

  return this;
};

/**
 * Shortcut of `noder.$di.invoke()`.
 *
 * Call a function with dependencies injection.
 *
 * Unlike `noder.$invoke()`,
 * the returned value of each dependency is passed to `fn`.
 *
 * @param {string|array|function} deps See [Collection.invoke()](collection.html#invoke).
 * @param {function}              [fn] See [Collection.invoke()](collection.html#invoke).
 *
 * @return {mixed}  The result of `fn`.
 *
 * @see Collection.invoke()
 * @see Noder.$inject()
 */
Noder.prototype.$invoke = function $invoke(deps, fn) {

  return this.$di.invoke(deps, fn);
};

/**
 * Shortcut of `noder.$di.inject()`.
 *
 * Call a function with dependencies injection.
 *
 * Unlike `noder.$invoke()`,
 * the raw value of each dependency is passed to `fn`.
 *
 * @param {string|array|function} deps See [Collection.inject()](collection.html#inject).
 * @param {function}              [fn] See [Collection.inject()](collection.html#inject).
 *
 * @return {mixed}  The result of `fn`.
 *
 * @see Collection.inject()
 * @see Noder.$invoke()
 */
Noder.prototype.$inject = function $inject(deps, fn) {

  return this.$di.inject(deps, fn);
};

/**
 * Shortcut of `noder.$di.provider()`.
 *
 * Create a `provider` that supports dependencies injection.
 * When the item `key` is called,
 * it calls the function `fn` by passing dependencies `deps`.
 *
 * This method defines a function that returns the result
 * of `noder.$di.inject(deps, fn)`.
 *
 * @param {string}                key   The key (provider identifier).
 * @param {string|array|function} deps  See [Noder.$inject()](#$inject).
 * @param {function}              [fn]  See [Noder.$inject()](#$inject).
 *
 * @return {Noder} The current `Noder` instance.
 *
 * @see Collection.provider()
 * @see Noder.$inject()
 * @see Noder.$factory()
 * @see Noder.$singleton()
 * @see Noder.$wrap()
 */
Noder.prototype.$provider = function $provider(key, deps, fn) {

  this.$di.provider(key, deps, fn);

  return this;
};

/**
 * Shortcut of `noder.$di.factory()`.
 *
 * Create a `factory` that supports dependencies injection.
 * When the item `key` is called,
 * it calls the function `fn` by passing dependencies `deps`.
 *
 * This method defines a function that returns the result
 * of `noder.$di.invoke(deps, fn)`.
 *
 * @param {string}                key   The key (factory identifier).
 * @param {string|array|function} deps  See [Noder.$invoke()](#$invoke).
 * @param {function}              [fn]  See [Noder.$invoke()](#$invoke).
 *
 * @return {Noder} The current `Noder` instance.
 *
 * @see Collection.factory()
 * @see Noder.$invoke()
 * @see Noder.$provider()
 * @see Noder.$singleton()
 * @see Noder.$wrap()
 */
Noder.prototype.$factory = function $factory(key, deps, fn) {

  this.$di.factory(key, deps, fn);

  return this;
};

/**
 * Shortcut of `noder.$di.singleton()`.
 *
 * Create a singleton (function shared).
 *
 * @param {string}   key  The key (function identifier).
 *
 * @param {function} fn   The function, executed once,
 * after the value is returned when is again called.
 *
 * @return {Noder} The current `Noder` instance.
 *
 * @see Collection.singleton()
 * @see Noder.$provider()
 * @see Noder.$factory()
 * @see Noder.$wrap()
 */
Noder.prototype.$singleton = function $singleton(key, fn) {

  this.$di.singleton(key, fn);

  return this;
};

/**
 * Shortcut of `noder.$di.apply()`.
 *
 * Calls a given function by binding the scope (`this`) to the `$di` container
 * (`noder.$di._container`).
 *
 * @example
 *   noder.$di.set('name', 'Nico');
 *
 *   // returns 'Nico'
 *   noder.$apply(function() {
 *     return this.name;
 *   });
 *
 * @param {function|object} bindable     See [Collection.apply()](collection.html#apply).
 * @param {...mixed}        [arguments]  Zero, one or more arguments passed to `bindable`.
 *
 * @return {mixed} The value returned by `bindable`.
 *
 * @see Collection.apply()
 * @see Noder.inject()
 */
Noder.prototype.$apply = function $apply(bindable) {

  return this.$di.apply(bindable);
};

/**
 * Shortcut of `noder.$di.wrap()`.
 *
 * Wrap a value.
 * Useful to avoid calling a function in the implementation
 * of a _provider_ or a _factory_.
 *
 * @param  {mixed} value  The value to wrap.
 * @return {function}    `value` wrapped by a function.
 *
 * @see Collection.wrap()
 */
Noder.prototype.$wrap = function $wrap(value) {

  return this.$di.wrap(value);
};

/**
 * Lazy `require()`, register a new lazy loadable property
 * whose the value will be assigned on the fly with `require()` only when it is used.
 *
 * The property configuration is :
 *  * enumerable:   true,
 *  * configurable: false,
 *  * writable:     false
 *
 * @example
 *  // Register `markdown` property
 *  // Note: `marked` module is not loaded
 *  noder.$require('markdown', 'marked');
 *
 *  // Now load the `marked` module in the `markdown` property
 *  noder.markdown;
 *
 * @example
 *   // Register a sub-property.
 *   noder.models = {};
 *
 *   noder.$require('User', './models/user', noder.models);
 *
 *   // Load the `./models/user` module in `noder.models.User` property.
 *   noder.models.User.someMethod();
 *
 * @param {string|function} property The property name
 *                                   or `required` value if the `required`
 *                                   argument is not provided (shortcut).
 *
 * @param {string|function} [required] The module name or the JS file path
 *                                     required to set the property value.
 *                                     Or a custom loader handler
 *                                     via a given function, the scope (`this`)
 *                                     bind to `noder.$di._container`
 *                                     like `noder.$apply()`.
 *
 * Note:
 *  * The `required` argument is passed to the function `require()`.
 *  * The `required` item is only loaded the first time (singleton).
 *
 * @param {object} [obj] The object where the property is created.
 *                       If is not provided, it's the current instance of `Noder`.
 *
 * @return {Noder} The current `Noder` instance.
 */
Noder.prototype.$require = function $require(property, required, obj) {

  var ref;
  var _this = this;

  obj = obj || this;

  Object.defineProperty(obj, property, {

    enumerable   : true,
    configurable : false,

    get: function() {

      // most cases, faster checking
      if (typeof ref != 'undefined') {
        return ref;
      }

      // rare cases, ensure the modules with undefined return
      if(_this.$require.isLoaded(property, obj)) {
        return ref;
      }

      if(!required) {
        required = property;
      }

      ref = (typeof required === 'function' ?
        required.call(_this.$di._container) : require(required));

      if(!loaded[property]) {
        loaded[property] = [];
      }

      loaded[property].push(obj);

      return ref;
    },

    set: function() {
      throw new Error(
        '"' + property +'" property is not writable because is a placeholder ' +
        'of a property of a lazy loading module.'
      );
    }
  });

  return this;
};

/**
 * Check if a given module is loaded.
 *
 * @example
 *  noder.$require('express');
 *
 *  // false
 *  console.log(noder.$require.isLoaded('express'));
 *
 *  var express = noder.express;
 *
 *  // true
 *  console.log(noder.$require.isLoaded('express'));
 *
 * @param {string}  property The property name.
 * @param {object} [obj] Object to check the property. If is not provided,
 *                       it's the current instance of `Noder`.
 * @return {bool} `true` if the given module is loaded, `false` otherwise.
 * @see Noder.$require()
 */
Noder.prototype.$require.isLoaded = function isLoaded(property, obj) {

  if(!obj) {
    return loaded[property] ? true : false;
  }

  if(!loaded[property]) {
    return false;
  }

  obj = obj || this;

  return (loaded[property].indexOf(obj) !== -1);
};

module.exports = new Noder();
