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

var utils = require('./utils');

/**
 * Create a new collection.
 *
 * @constructor
 *
 * @example
 *   var items = new Collection();
 *
 * @param {object} [values] Values to add in the collection.
 * @throws {TypeError} If the arguments `values` is provided is not an `object`.
 */
function Collection(values) {

  /**
   * Items container.
   * All values of the collection are stored in the container.
   * @type {object}
   */
  this._container = values || {};

  if (values && typeof values !== 'object') {
    throw new TypeError(
      'Argument #1 passed to Collection must be an object'
    );
  }
}

/**
 * Get all keys of the collection.
 *
 * @example
 *   items.keys();
 *
 * @return {array} An array of keys.
 */
Collection.prototype.keys = function keys() {
  return Object.keys(this._container);
};

/**
 * Checks if an item exists
 *
 * @example
 *  items.set('keyName', 'any value');
 *
 *  if(items.has('keyName')) {
 *    console.log('has `keyName`');
 *  }
 *
 * @param {string} key The key of the item to check.
 * @return {bool} `true` if exists, `false` otherwise.
 * @throws {TypeError} If `key` is not a `string`.
 */
Collection.prototype.has = function has(key) {

  if (typeof key !== 'string') {
    throw new TypeError(
      'Argument #1 passed to Collection.has() must be a string identifier, ' +
      Object.prototype.toString(key) + ' given'
    );
  }

  return (key in this._container === true);
};

/**
 * Remove an item.
 *
 * @example
 *  items.set('keyName', 'any value');
 *
 *  // true
 *  console.log(items.has('keyName'));
 *
 *  items.remove('keyName');
 *
 *  // false
 *  console.log(items.has('keyName'));
 *
 * @param {string} key  The key of item to remove.
 * @return {Collection} The current ìnstance.
 * @throws {TypeError} If `key` is not a `string`.
 */
Collection.prototype.remove = function remove(key) {

  if (typeof key !== 'string') {
    throw new TypeError(
      'Argument #1 passed to Collection.remove() must be a string ' +
      'identifier'
    );
  }

  delete this._container[key];

  return this;
};

/**
 * Set an item.
 *
 * @example
 *   items.set('hello', 'Hello World!');
 *
 *   // Hello World!
 *   console.log(items.get('hello'));
 *
 * @param {string} key   Key name.
 * @param {mixed}  value The value.
 * @return {Collection} The current ìnstance.
 * @throws {TypeError} If `key` is not a `string`.
 */
Collection.prototype.set = function set(key, value) {

  if (typeof key !== 'string') {
    throw new TypeError(
      'Argument #1 passed to Collection.set() must be a string identifier'
    );
  }

  this._container[key] = value;

  return this;
};

/**
 * Set all items of the collection.
 * All collection is overwritten by the given set of items.
 *
 * @example
 *   items.setAll({
 *     a: 'value 1',
 *     b: 'value 2',
 *     c: 'value 3'
 *   });
 *
 * @param {values} values The new values of the collection.
 *
 * @return {Collection} The current ìnstance.
 * @throws {TypeError} If `values` is not an `object`.
 */
Collection.prototype.setAll = function setAll(values) {

  if (typeof values !== 'object') {
    throw new TypeError(
      'Argument #1 passed to Collection.setAll() must be an object'
    );
  }

  this._container = values;

  return this;
};

/**
 * Add all items in the collection.
 *
 * items.addAll({
 *     a: 'value 1',
 *     b: 'value 2',
 *     c: 'value 3'
 *   });
 *
 * @param {object} values The values to add.
 *                        The existing values are overwritten,
 *                        the other items are preserved.
 *
 * @return {Collection} The current ìnstance.
 * @throws {TypeError} If `values` is not an `object` or if a key is not a `string`.
 */
Collection.prototype.addAll = function addAll(values) {

  if (typeof values !== 'object') {
    throw new TypeError(
      'Argument #1 passed to Collection.addAll() must be an object'
    );
  }

  for (var key in values) {
    this.set(key, values[key]);
  }

  return this;
};

/**
 * Add once an item in the collection.
 * Identical to [Collection.set()](#set) method, except the item is added only
 * if it is not already defined in the collection.
 *
 * @param {string} key The key name.
 *
 * @param {mixed} value The value.
 *
 * @param {bool} [skip_if_exists] Defines the behavior if the given key exists:
 *   * if `truthy`, nothing happens and the item already defined is not overwritten
 *   * if `falsy` (by default) an `Error` is thrown
 *
 * @return {Collection} The current ìnstance.
 *
 * @throws {TypeError} If `key` is not a `string`.
 *
 * @throws {Error} If an item is already defined
 *                  with the same `key` and `skip_if_exists` is not `truthy`.
 *
 * @see Collection.addOnceAll()
 * @see Collection.set()
 */
Collection.prototype.addOnce = function addOnce(key, value, skip_if_exists) {

  if (this.has(key)) {

    if (skip_if_exists){
      return this;
    }

    throw new Error(
      'Identifier ' + key + ' passed to Collection.addOnce() ' +
      'is already defined'
    );
  }

  return this.set(key, value);
};

/**
 * Add all items in the collection only if not already defined.
 *
 * @param {object} values Identical to [Collection.addAll()](#addAll) method.
 *
 * @param {bool} [skip_if_exists] Defines the behavior if an item exists:
 *   * if `truthy`, nothing happens and the item already defined is not overwritten
 *   * if `falsy` (by default) an `Error` is thrown
 *
 * @return {Collection} The current ìnstance.
 *
 * @throws {TypeError} If `values` is not an `object` or if a key is not a `string`.
 * @throws {Error} If an item is already defined and `skip_if_exists` is not `truthy`.
 *
 * @see Collection.addOnce()
 * @see Collection.addAll()
 */
Collection.prototype.addOnceAll = function addOnceAll(values, skip_if_exists) {

  if (typeof values !== 'object') {
    throw new TypeError(
      'Argument #1 passed to Collection.addOnceAll() must be an object'
    );
  }

  for (var key in values) {
    this.addOnce(key, values[key], skip_if_exists);
  }

  return this;
};

/**
 * Merge `values` (recursive) in the collection.
 *
 * @param  {object}   values Values to merge.
 * @param {...object} [values] Zero, one or several other objects.
 *
 * @return {Collection} The current ìnstance.
 * @throws {TypeError} If `values` is not an `object`.
 */
Collection.prototype.merge = function merge(values) {

  if (typeof values !== 'object') {
    throw new TypeError(
      'Argument #1 passed to Collection.merge() must be an object'
    );
  }

  var args = Array.prototype.concat.apply([this._container], arguments);

  this._container = utils.mergeRecursive.apply(utils, args);

  return this;
};

/**
 * Get all items of the collection.
 *
 * @return {object} All items defined in the collection.
 */
Collection.prototype.getAll = function getAll() {

  return this._container;
};

/**
 * Get an item value.
 *
 * If the item is a function, the fonction is called
 * and `get()` returns the value returned by the function called.
 *
 * If you want the raw value, uses [Collection.raw()](#raw).
 *
 * @example
 *   items.addAll({
 *     a: 'value of "a"',
 *     b: function() {
 *       'value of "b"'
 *     }
 *   });
 *
 *   // value of "a", string
 *   console.log(items.get('a'), typeof items.get('a'));
 *
 *   // value of "b", string
 *   console.log(items.get('b'), typeof items.get('b'));
 *
 *   // value of "a", string
 *   console.log(items.raw('a'), typeof items.raw('a'));
 *
 *   // [Function], function
 *   console.log(items.raw('b'), typeof items.raw('b'));
 *
 * @param {string} key The key of the item
 *
 * @param {mixed} [default_value] The default value if the item
 *                                does not exist (`default_value` is ignored
 *                                if `strict` is `truthy`).
 *
 * @param {bool} [strict] If `truthy` and the item does not exist,
 *                        throws an `Error` (`default_value` is ignored
 *                        if `strict` is `truthy`).
 *
 * @return {mixed}     The item value (if defined).
 * @return {mixed}     Returns `default_value` if:
 *  * a default value is defined
 *  * `strict` is not `truthy`
 *  * the item (`key`) does not exist
 *
 * @throws {TypeError} If `key` is not a `string`.
 * @throws {Error} If `strict` is `truthy` and the item does not exist.
 *
 * @see Collection.raw()
 * @see Collection.apply()
 * @see Collection.invoke()
 */
Collection.prototype.get = function get(key, default_value, strict) {

  if (typeof this._container[key] === 'function') {
    return this._container[key]();
  }

  if (this.has(key)) {
    return this._container[key];
  }

  if (typeof default_value === 'function') {
    return this.raw(key, default_value, strict)();
  }

  return this.raw(key, default_value, strict);
};

/**
 * Get an item.
 *
 * @example
 *   items.set('multiply', function(a, b) {
 *     return a * b;
 *   });
 *
 *   var multiply = items.raw('multiply');
 *
 *   // returns 8
 *   multiply(2, 4);
 *
 *   // or directly
 *   // returns 8
 *   items.raw('multiply')(2, 4);
 *
 *   // or equivalent by injection
 *
 *   // returns 8
 *   items.inject('multiply', function(multiply) {
 *     return multiply(2, 4);
 *   });
 *
 *   // returns 8
 *   items.apply(function() {
 *     return this.multiply(2, 4);
 *   });
 *
 * @param {string} key The key of the item
 *
 * @param {mixed} [default_value] The default value if the item
 *                                does not exist (`default_value` is ignored
 *                                if `strict` is `truthy`).
 *
 * @param {bool} [strict] If `truthy` and the item does not exist,
 *                        throws an `Error` (`default_value` is ignored
 *                        if `strict` is `truthy`).
 *
 * @return {mixed}     The item value (if defined).
 *
 * @return {mixed}     Returns `default_value` if:
 *  * a default value is defined
 *  * `strict` is not `truthy`
 *  * the item (`key`) does not exist
 *
 * @throws {TypeError} If `key` is not a `string`.
 *
 * @throws {Error} If `strict` is `truthy` and the item does not exist.
 *
 * @see Collection.get()
 * @see Collection.apply()
 * @see Collection.inject()
 */
Collection.prototype.raw = function raw(key, default_value, strict) {

  if (this.has(key)) {
    return this._container[key];
  }

  if (strict){
    throw new Error('Identifier ' + key + ' is not defined');
  }

  return default_value;
};

/**
 * Call a function with dependencies injection.
 *
 * Unlike `Collection.invoke()`,
 * the raw value of each dependency is passed to `fn`.
 *
 * @example
 *   items.set('multiply', function(a, b) {
 *     return a * b;
 *   });
 *
 *   // returns 8
 *   items.inject('multiply', function(multiply) {
 *     return multiply(2, 4);
 *   });
 *
 *   // or equivalent
 *
 *   // return 8
 *   items.apply(function() {
 *     return this.multiply(2, 4);
 *   });
 *
 *   // returns 8
 *   items.raw('multiply')(2, 4);
 *
 * @param {string|array|function} deps  Dependencies to inject as arguments of
 *                                      the function (`fn`).
 *                                      Or only a function that receives
 *                                      in first argument
 *                                      the container of `Collection` instance.
 *
 * @param {function} [fn]   Function to call. Dependencies are passed as arguments
 *                          in the order of declaration.
 *                          If `deps` is a function, this argument is ignored.
 *
 * @return {mixed}   The value returned by the given function.
 *
 * @throws {TypeError} If a key is not a `string`.
 *
 * @see Collection.invoke()
 * @see Collection.raw()
 * @see Collection.apply()
 */
Collection.prototype.inject = function inject(deps, fn) {

  if (Array.isArray(deps)) {

    for(var i in deps) {
      deps[i] = this.raw(deps[i]);
    }

    return fn.apply(null, deps);
  }

  return typeof deps === 'function' ? deps(this._container) : fn(this.raw(deps));
};

/**
 * Call a function with dependencies injection.
 *
 * Unlike `Collection.inject()`,
 * the returned value of each dependency is passed to `fn`.
 *
 * @example
 *  items.addAll({
 *    name: 'Nico',
 *    hello: function(){
 *      return 'Hello ' + this.name;
 *    }
 *  });
 *
 *  items.invoke('hello', function(hello) {
 *
 *    // Hello Nico
 *    console.log(hello);
 *  });
 *
 * @param {string|array|function} deps  Dependencies to call and inject the
 *                                      returned value as arguments of
 *                                      the function (`fn`).
 *                                      Or only a function that receives
 *                                      in first argument
 *                                      the container of `Collection` instance.
 *
 * @param {function} [fn]   Function to call. Dependencies are passed as arguments
 *                          in the order of declaration.
 *                          If `deps` is a function, this argument is ignored.
 *
 * @return {mixed} The value returned by the given function.
 *
 * @throws {TypeError} If a key is not a `string`.
 *
 * @see Collection.get()
 * @see Collection.inject()
 * @see Collection.apply()
 */
Collection.prototype.invoke = function invoke(deps, fn) {

  if (Array.isArray(deps)) {

    for(var i in deps) {
      deps[i] = this.get(deps[i]);
    }

    return fn.apply(null, deps);
  }

  return typeof deps === 'function' ? deps(this._container) : fn(this.get(deps));
};

/**
 * Calls a given function by binding the scope (`this`) to the container
 * (`Collection._container`).
 *
 * The javascript function implements natively the methods `call()` and `apply()`.
 *
 * It is possible that `bindable` argument is not a function,
 * in this case it is necessary that the object implements
 * `call(container)` and `apply(container, args)`, then handles the logic.
 *
 * @example
 *   var fn = function() {
 *     return this === items._container;
 *   };
 *
 *   // true
 *   console.log(items.apply(fn));
 *
 * @param  {function|object} bindable Function or object to call and whose
 *                                    the scope (`this`) will bind to container.
 *
 * @param {...mixed}         [arguments]  Zero, one or more arguments
 *                                        passed to `bindable`.
 *
 * @return {mixed} The value returned by `bindable`.
 *
 * @see Collection.inject()
 * @see Collection.invoke()
 */
Collection.prototype.apply = function apply(bindable) {

  if(arguments.length > 1) {

    var args = Array.prototype.slice.call(arguments, 1);

    return bindable.apply(this._container, args);
  }

  return bindable.call(this._container);
};


/**
 * Wrap a value.
 * Useful to avoid calling a function in the implementation
 * of a _provider_ or a _factory_.
 *
 * @param  {mixed} value  The value to wrap.
 * @return {function}    `value` wrapped by a function
 *
 * @see Collection.singleton()
 * @see Collection.provider()
 * @see Collection.factory()
 */
Collection.prototype.wrap = function wrap(value) {

  return function wrapper() {
    return value;
  };
};

/**
 * Create a singleton (function shared).
 *
 * @param {string} key The key (function identifier).
 *
 * @param {function} fn The function, executed once,
 * after the value is returned when is again called.
 *
 * @return {Collection} The current ìnstance.
 *
 * @throws {TypeError} If `key` is not a `string` or if `fn` is not a `function`.
 *
 * @see Collection.provider()
 * @see Collection.factory()
 * @see Collection.wrap()
 */
Collection.prototype.singleton = function singleton(key, fn) {

  var ret;
  var shared;

  if (typeof key !== 'string') {
    throw new TypeError(
      'Argument #1 passed to Collection.singleton() must be a string ' +
      'identifier'
    );
  }

  if (typeof fn !== 'function') {
    throw new TypeError(
      'Argument #2 passed to Collection.singleton() must be a function'
    );
  }

  this._container[key] = function() {

    if (!ret) {
      ret    = true;
      shared = arguments.length ? fn.apply(null, arguments) : fn();
    }

    return shared;
  };

  return this;
};

/**
 * Create a _provider_ that supports dependencies injection.
 * When the item `key` is called,
 * it calls the function `fn` by passing dependencies `deps`.
 *
 * This method defines a function that returns the result
 * of [Collection.inject(deps, fn)](#inject).
 *
 * @example
 *   items.set('hello', function() {
 *     return 'Hello World!';
 *   });
 *
 *   items.provider('sayHello', ['hello'], function(hello) {
 *     return hello();
 *   });
 *
 *   // 'Hello World!'
 *   items.get('sayHello');
 *
 *   // or with the scope in any injector
 *   items.apply(function() {
 *
 *     // 'Hello World!'
 *     console.log(this.sayHello);
 *   });
 *
 * @param {string}                key   The key (provider identifier).
 * @param {string|array|function} deps  See [Collection.inject()](#inject).
 * @param {function}              [fn]  See [Collection.inject()](#inject).
 *
 * @return {Collection} The current ìnstance.
 *
 * @throws {TypeError} If `key` is not a `string`
 *  or if a given key in `deps` is not a `string`.
 *
 * @see Collection.inject()
 * @see Collection.factory()
 * @see Collection.singleton()
 * @see Collection.wrap()
 */
Collection.prototype.provider = function provider(key, deps, fn) {

  var _this = this;
  var ret;
  var shared;

  if (typeof key !== 'string') {
    throw new TypeError(
      'Argument #1 passed to Collection.provider() must be a string ' +
      'identifier'
    );
  }

  this._container[key] = function() {

    if(!ret) {
      ret    = true;
      shared = _this.inject(deps, fn);
    }

    return shared;
  };

  return this;
};

/**
 * Create a _factory_ that supports dependencies injection.
 * When the item `key` is called,
 * it calls the function `fn` by passing dependencies `deps`.
 *
 * This method defines a function that returns the result
 * of [Collection.invoke(deps, fn)](#invoke).
 *
 * @example
 *   items.set('hello', function() {
 *     return 'Hello World!';
 *   });
 *
 *   items.factory('sayHello', ['hello'], function(hello) {
 *     return hello;
 *   });
 *
 *   // 'Hello World!'
 *   items.get('sayHello');
 *
 *   // or with the scope in any injector
 *   items.apply(function() {
 *
 *     // 'Hello World!'
 *     console.log(this.sayHello);
 *   });
 *
 * @param {string}                key   The key (factory identifier).
 * @param {string|array|function} deps  See `Collection.invoke()`.
 * @param {function}              [fn]  See `Collection.invoke()`.
 *
 * @return {Collection} The current ìnstance.
 *
 * @throws {TypeError} If `key` is not a `string`
 *   or if a given key in `deps` is not a `string`.
 *
 * @see Collection.invoke()
 * @see Collection.provider()
 * @see Collection.singleton()
 * @see Collection.wrap()
 */
Collection.prototype.factory = function factory(key, deps, fn) {

  var _this = this;
  var ret;
  var shared;

  if (typeof key !== 'string') {
    throw new TypeError(
      'Argument #1 passed to Collection.factory() must be a string ' +
      'identifier'
    );
  }

  this._container[key] = function() {

    if(!ret) {
      ret    = true;
      shared = _this.invoke(deps, fn);
    }

    return shared;
  };

  return this;
};


module.exports = Collection;