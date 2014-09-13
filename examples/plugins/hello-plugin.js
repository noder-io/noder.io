'use strict';

var plugin;

/**
 * Create `helloProvider`
 */
function createProvider() {

  plugin.$provider('helloProvider', function(name) {

    // get `question` if defined,
    // otherwise use the default value `How are you?`
    return 'hello ' + name + ', ' + plugin.$di.get('question', 'How are you?');
  });
}

/**
 * Create `helloFactory`
 */
function createFactory() {

  // `hello` = `helloProvider`
  plugin.$provider('helloFactory', ['helloProvider'], function(hello) {
    return 'I say' + hello('Noder !');
  });
}

/**
 * Initialization for use as a standalone module.
 * @return {Noder} Current `Noder` instance
 */
module.exports = function hello() {

  var Noder = require('noder.io').Noder;

  return this.__noder(new Noder());
};

/**
 * Init the plugin `helloPlugin`.
 *
 * @param  {Noder} noder A `Noder` instance.
 * @return {Noder}       Returns current instance.
 */
module.exports.__noder = function helloPlugin(noder) {

  plugin = noder;

  plugin.$di.set('description', 'A new item from helloPlugin');

  // populate `noder` with new data and new features
  createProvider();
  createFactory();

  plugin.$inject('log', function(log) {
    log('helloPlugin is loaded in the API.');
  });

  return this;
};