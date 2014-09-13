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

var test  = require('unit.js');
var Noder = require('../../src/index').Noder;
var plugin;

function populate() {

  test
    .object(plugin)
      .isInstanceOf(Noder)

	  .string(plugin.$di.get('initialItem'))
      .isIdenticalTo('initial item from noder')
  ;

  plugin.$di.addAll({
    initialItem: 'initial item modified by noderPlugin',
    pluginItem: 'item added by noderPlugin'
  });
}

/**
 * Init the plugin `noderPlugin`
 * @param  {Noder} noder  `Noder` instance
 * @return {Noder}        Current `Noder` instance
 */
module.exports.__noder = function noderPlugin(noder) {

  plugin = noder;

  populate();

  if(arguments.length > 1) {
    plugin.$di.set('args', arguments);
  }

  return plugin;
};