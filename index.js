/**
 * This file is part of Noder.io.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 * 
 * For the full copyright and license information, please view 
 * the LICENSE file that was distributed with this source code 
 * or visit {@link http://noder.io|Noder.io}.
 *
 * @author Nicolas Tallefourtane <dev@nicolab.net>
 */

'use strict';

var debug = require('debug');

// express application
var app;

// modules loaded
var loaded = {
  'configurator': require('convict'),
  'debug': 				debug
};

// modules list
var modules = {
	'configurator':  'convict',
	'debug':         'debug',
	'logger':        'winston',
	'json':          'cjson',
	'mout':          'mout',
	'_':             'lodash',
	'_.str':         'underscore.string',
	'seq':           'lazy',
	'async':         'async',
	'q':             'kew',
	'promise':       'bluebird',
	'mixin':         'mixing',
	'compose':       'compose',
	'patch':         'hooker',
	'validation':    'validatorjs',
	'validator':     'revalidator',
	'check':         'validator',
	'moment':        'moment',
	'engines':       'consolidate',
	'socket':        'socket.io',
	'dom':           'cheerio',
	'swig':          'swig',
	'lang':          'jus-i18n',
	'markdown':      'marked',
	'commander':     'commander',
	'prompter':      'inquirer',
	'passport':      'passport'
};

/**
 * Check if the module is loaded
 * @param  {string}  property The property name
 * @return {Boolean}
 */
function isLoaded(property) {
  return undefined !== loaded[property];
}

/**
 * Create a lazy loadable property
 * @param  {[type]} property The property name
 * @param  {string|function} required
 * @return {mixed}     The module
 */
function createPropertyLazyLoader(property, required) {

  Object.defineProperty(noder, property, {

    enumerable: true,
    configurable: false,

    get: function() {

      if (isLoaded(property))
        return loaded[property];

      if (typeof(required) == 'function') {
        required = required.call(noder);
      }

      loaded[property] = require(required);

      return loaded[property];
    },

    set: function() {
      throw new Error(
      	'"' + property +'" property is not writable because is a placeholder ' +
      	'of a lazy loaded item.'
      );
    }
  });
}

/**
 * The noder object.
 *
 * @example
 * 
 * ``` js
 *	node.markdown; // load "marked" module
 * ```
 *
 * Minimal usage:
 *
 * ```js
 * console.log(noder.markdown('I am using __markdown__.'));
 * // Outputs: <p>I am using <strong>markdown</strong>.</p>
 * ```
 *
 * Example using all options:
 *
 * ```js
 * // Set default options except highlight which has no default
 * noder.markdown.setOptions({
 * 		gfm: true,
 * 		highlight: function (code, lang, callback) {
 * 			pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
 *
 *    			if (err)
 *					return callback(err);
 *
 *     			callback(null, result.toString());
 *   		});
 * 		},
 * 		tables: true,
 * 		breaks: false,
 * 		pedantic: false,
 * 		sanitize: true,
 * 		smartLists: true,
 * 		smartypants: false,
 * 		langPrefix: 'lang-'
 * 	});
 *
 *	// Using async version of marked
 *	noder.markdown('I am using __markdown__.', function (err, content) {
 *
 *		if (err)
 * 			throw err;
 *
 * 		console.log(content);
 *	});
 *
 * ```
 * 
 * Create a collection
 *
 * ``` js
 * 	var collection = new noder.Collection();
 *
 *	collection.set('my key', 'my value');
 *  console.log(collection.get('my key')); // my value
 * ```
 */
var noder = {

  /**
   * Create a collection.
   *
   * ``` js
   * var collection = new noder.Collection();
   *
   * collection.set('my key', 'my value');
   * console.log(collection.get('my key')); // my value
   *
   * ```
   * @param {object} values (optional) Populates the collection.
   * ``` js
   * var collection = new noder.Collection({'foo': 'bar'});
   *
   * console.log(collection.get('foo')); // display "bar"
   *
   * ```
   */
  Collection: function(values) {

    this._container = values || {};

    if (values && typeof values !== 'object') {
      throw new TypeError(
      	'Argument #1 passed to noder.Collection must be an object'
      );
    }
  },

  /**
   * Lazy loader.
   *
   * @type {object}
   */
  lazyLoader: {

    /**
     * Register a new property that will be defined on the fly if it is used.
     *
     * The property configuration is :
     *  * enumerable: 	true,
     *  * configurable: 	false,
     *  * writable: 		false
     *
     * @param {string} property The property name
     * @param {string|function} required The package name 
     * or the JS file required to set the property value.
     * 
     * Note:
     *  * The "required" argument is passed to the function require() of Node.JS.
     *  * The "required" item is only loaded the first time (singleton).
     *  
     * @return {object} noder
     */
    register: function(property, required) {

      createPropertyLazyLoader(property, required);

      return this;
    }
  }
};

debug('noder')('defined noder and bundles');

noder.Collection.prototype = {

  /*
   * Dependencies injection
   * 
   * @param {array} deps
   * @param {function} module
   * @return {mixed}
   */
  use: function(deps, module) {

    if (deps.constructor.name === 'Array') {
      deps = deps || [];

      deps.forEach(
        function(value, key) {
          deps[key] = this.get(value);
        },
        this
      );

      deps.push(this);

      return module.apply(null, deps);

    } else {
    	
      if (typeof deps === 'function') {
        return deps(this);
      } else {
        return module(this);
      }
    }
  },

  /**
   * Get all items of the collection.
   * 
   * @return {object} noder
   */
  getAll: function() {

    return this._container;
  },

  /**
   * Add all items in the collection.
   * @param {object} values The values to add. 
   * The values ​​that exist are overwritten, the others items are preserved.
   * 
   * @return {object} noder
   */
  addAll: function(values) {

    if ((typeof values) !== 'object') {
      throw new TypeError(
        'Argument #1 passed to noder.Collection.addAll must be an object'
      );
    }

    for (var key in values) {
      this.set(key, values[key]);
    }

    return this;
  },

  /**
   * Add all items in the collection only if not already defined.
   * 
   * @param {object} values Identical to noder.Collection.addAll() method 
   * except :
   *   * if the values ​​that exist are skipped if 'skip_if_exists' is true
   *   * or throws a 'TypeError' if 'skip_if_exists' is falsy (by default).
   *   
   * @param {bool} skip_if_exists Defines the behavior if an item exists:
   *   * if true, nothing happens and the item already defined is not overwritten
   *   * if falsy (by default) an 'Error' is thrown
   *   
   * @return {object} noder
   * @throws {Error} Throws a 'Error' if an item is already defined 
   * and 'skip_if_exists' is not a true.
   */
  addOnceAll: function(values, skip_if_exists) {

    if ((typeof values) !== 'object') {
      throw new TypeError(
        'Argument #1 passed to noder.Collection.addOnceAll must be an object'
      );
    }

    for (var key in values) {
      this.addOnce(key, values[key], skip_if_exists);
    }

    return this;
  },

  /**
   * Set all items of the collection.
   * @param {values} values The new values of the collection, 
   * all collection values is overwritten by the currently set of items.
   * @return {object} noder
   */
  setAll: function(values) {

    if ((typeof values) !== 'object') {
      throw new TypeError(
        'Argument #1 passed to noder.Collection.setAll must be an object'
      );
    }

    this._container = values;

    return this;
  },

  /**
   * Checks if an item exists
   * @param {string} key The key of the item
   * @return {bool}
   */
  has: function(key) {

    if (typeof key !== 'string') {
      throw new TypeError(
        'Argument #1 passed to noder.Collection.has must be a string identifier'
      );
    }

    return key in this._container === true;
  },

  /**
   * Get an item value.
   * 
   * @param {string} key The key of the item
   * 
   * @param {mixed} default_value The default value if the item 
   * does not exist (default_value is ignored if strict is true).
   * 
   * @param {bool} strict If true and the item does not exist, 
   * throws an 'Error' (default_value is ignored if strict is true).
   * 
   * @return {mixed} The item value or default_value if is defined, 
   * strict is not true and the item does not exist.
   * 
   * @throws {Error} Throws an 'Error' if strict is true 
   * and the item does not exist.
   */
  get: function(key, default_value, strict) {

    if (typeof(this._container[key]) == 'function')
      return this._container[key]();

    if (true == this.has(key)) {

      return this._container[key];
    }

    if (typeof(default_value) == 'function')
      return this.raw(key, default_value, strict)();

    return this.raw(key, default_value, strict);
  },

  /**
   * Get an item.
   * 
   * @param {mixed} default_value The default value if the item 
   * does not exist (default_value is ignored if strict is true).
   * 
   * @param {bool} strict If true and the item does not exist, 
   * throws an 'Error' (default_value is ignored if strict is true).
   * 
   * @return {mixed} The item or default_value if is defined, 
   * strict is not true and the item does not exist.
   * 
   * @throws {Error} Throws an 'Error' if strict is true 
   * and the item does not exist.
   */
  raw: function(key, default_value, strict) {

    if (this.has(key) === false) {

      if (strict){
        throw new Error('Identifier ' + key + ' is not defined');
      }

      return default_value;
    }

    return this._container[key];
  },

  /**
   * Create a singleton (function shared).
   * 
   * @param {string} key The key (function identifier).
   * 
   * @param {function} fn The function, executed once, 
   * after the value is returned when is again called.
   * 
   * @return {mixed} The function value.
   */
  singleton: function(key, fn) {
    if (typeof key !== 'string') {
      throw new TypeError(
        'Argument #1 passed to noder.Collection.singleton must be a string ' +
        'identifier'
      );
    }

    if (typeof fn !== 'function') {
      throw new TypeError(
        'Argument #2 passed to noder.Collection.singleton must be a function'
      );
    }

    var shared;

    this._container[key] = function() {

      if (shared === undefined) {
        shared = arguments.length ? fn.apply(undefined, arguments) : fn();
      }

      return shared;
    };

    return this;
  },

  /**
   * Add once an item (if not defined).
   * 
   * @param {string} key
   * 
   * @param {mixed} value
   * 
   * @param {object} value Identical to noder.Collection.set() method except :
   *   * if the value ​​that exist is skipped if 'skip_if_exists' is true
   *   * or throws an 'Error' if 'skip_if_exists' is falsy (by default).
   * @param {bool} skip_if_exists Defines the behavior if an item exists:
   *   * if true, nothing happens and the item already defined is not overwritten
   *   * if falsy (by default) an 'Error' is thrown
   *   
   * @return {object} noder
   * 
   * @throws {Error} Throws an 'Error' if an item is already defined 
   * with the 'key' name and 'skip_if_exists' is not a true.
   */
  addOnce: function(key, value, skip_if_exists) {

    if (this.has(key) === true) {

      if (skip_if_exists == true){
        return this;
      }

      throw new Error(
      	'Identifier ' + key + ' passed to noder.Collection.addOnce ' +
      	'is already defined'
      );
    }

    return this.set(key, value);
  },

  /**
   * Set an item.
   * @param {string} key
   * @param {mixed} value
   * @return {object} noder
   */
  set: function(key, value) {

    if (typeof key !== 'string') {
      throw new TypeError(
        'Argument #1 passed to noder.Collection.set must be a string identifier'
      );
    }

    this._container[key] = value;

    return this;
  },

  /**
   * Remove an item.
   * @param {string} key
   * @return {object} noder
   */
  remove: function(key) {

    if (typeof key !== 'string') {
      throw new TypeError(
        'Argument #1 passed to noder.Collection.remove must be a string ' +
        'identifier'
      );
    }

    delete this._container[key];

    return this;
  },

  /**
   * Get all keys of the collection.
   * @return {array} An array of keys names.
   */
  keys: function() {
    return Object.keys(this._container);
  }
}

debug('noder')('defined noder.prototype');

// define the initial schema of the noder configuration
/**
 * noder.conf is a noder.configurator object to store 
 * the configuration of your applications.
 * @augments {noder}
 * @type {noder.configurator}
 * @public
 */
noder.conf = loaded.configurator({
  env: {
    doc: 'The applicaton environment.',
    format: [
    	'production', 'development', 'test', 'stage', 'maintenance', 'degrad'
    ],
    default: 'development',
    env: 'NODE_ENV'
  },

  port: {
    doc: "The port to bind.",
    format: "port",
    default: 3000,
    env: "PORT"
  }
});

debug('noder')('init noder.conf');


// Modules list and create properties.
// The modules are not loaded, 
// each module is loaded (on the fly) only when it is used
for (var key in modules) {
  createPropertyLazyLoader(key, modules[key]);
}

debug('noder')('init lazy loading');

// perform validation, example :
// noder.conf.validate();

module.exports = noder;