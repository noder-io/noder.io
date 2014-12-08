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
