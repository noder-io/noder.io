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
window.noder = require('./index');