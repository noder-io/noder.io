/*! Noder.io | (c) 2014 Nicolas Tallefourtane | http://noder.io */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!************************!*\
  !*** ./src/browser.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

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
	
	/*----------------------------------------------------------------------------*\
	  Polyfill
	\*----------------------------------------------------------------------------*/
	
	if(!Array.isArray) {
	
	  var toString = Object.prototype.toString();
	
	  Array.isArray = function isArray(array) {
	
	    if (toString.call(array) === '[object Array]') {
	      return true;
	    } else if ( typeof array.slice === 'function' &&
	        typeof array.length === 'number') {
	      return true;
	    }
	
	    return false;
	  };
	}
	
	// expose
	window.noder = __webpack_require__(/*! ./index */ 1);

/***/ },
/* 1 */
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

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
	
	var Collection = __webpack_require__(/*! ./collection */ 2);
	
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
	
	    initPlugin(__webpack_require__(/*! . */ 3)(noderPlugin), arguments);
	
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
	        required.call(_this.$di._container) : __webpack_require__(/*! . */ 3)(required));
	
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


/***/ },
/* 2 */
/*!***************************!*\
  !*** ./src/collection.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

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
	
	var utils = __webpack_require__(/*! ./utils */ 4);
	
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

/***/ },
/* 3 */
/*!**********************!*\
  !*** ./src ^\.\/.*$ ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./collection": 2,
		"./collection.js": 2,
		"./index": 1,
		"./index.js": 1,
		"./utils": 4,
		"./utils.js": 4
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;


/***/ },
/* 4 */
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

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
	
	/**
	 * Merge object `b` in object `a`.
	 *
	 * @example
	 *  var a = { foo: 'bar' };
	 *  var b = { bar: 'baz' };
	 *
	 *  utils.merge(a, b);
	 *  // => { foo: 'bar', bar: 'baz' }
	 *
	 * @param {Object} a Object that receives the value of `b`.
	 * @param {Object} b Object to merge in `a`.
	 * @return {Object} `a` merged
	 */
	function merge(a, b) {
	
	  if (a && b) {
	    for (var key in b) {
	      a[key] = b[key];
	    }
	  }
	
	  return a;
	}
	
	/**
	 * Merge recursive.
	 *
	 * @param {object|array} obj       Object that receives the value of `from`
	 * @param {...object|array} from   One or more objects to merge in `obj`.
	 * @return {Object} `obj` merged
	 */
	function mergeRecursive(obj) {
	
	  var argLen = arguments.length;
	
	  if (argLen < 2) {
	    throw new Error('There should be at least 2 arguments passed to utils.mergeRecursive()');
	  }
	
	  for (var i = 1; i < argLen; i++) {
	    for (var p in arguments[i]) {
	      if (obj[p] && typeof obj[p] === 'object') {
	        obj[p] = mergeRecursive(obj[p], arguments[i][p]);
	      } else {
	        obj[p] = arguments[i][p];
	      }
	    }
	  }
	
	  return obj;
	}
	
	
	/*----------------------------------------------------------------------------*\
	  Expose
	\*----------------------------------------------------------------------------*/
	
	module.exports.merge          = merge;
	module.exports.mergeRecursive = mergeRecursive;


/***/ }
/******/ ])
//# sourceMappingURL=noder-dev.js.map