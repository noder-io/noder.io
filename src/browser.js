'use strict';

/*! Noder.io | (c) 2014 Nicolas Tallefourtane | http://noder.io */


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