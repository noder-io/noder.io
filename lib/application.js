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

var
  noder,
  app,
  exDebug = require('debug')('express:router'),

  // Router
  base_url      = '',
  namedRoutes   = [],
  utils         = require('../node_modules/express/lib/utils'),
  urlParser     = require('url'),
  exRouter      = require('../node_modules/express/lib/router/index'),
  exRouterPrototype       = exRouter.prototype,
  exRouterPrototypeRoute  = exRouterPrototype.route // parent access
;

// Router hook
exRouterPrototype.route = function(method, path, callbacks) {

  var def = arguments[1]; // method argument

  // if is not named route
  if (typeof def !== 'object' 
  || undefined === def['path'] 
  || undefined === def['as']) {

    return exRouterPrototypeRoute.apply(this, arguments);
  }

  // is named route

  exDebug('Adding custom data to the route {' + def['as'] + ' => ' + 
    def['path'] +'}'
  );

  arguments[1] = def['path'];

  var
    // value returned
    ret = exRouterPrototypeRoute.apply(this, arguments),

    // get and remove the last route added
    route = this.map[method].pop()
  ;

  // add custom data

  delete def['path'];

  for (var key in def) {
    route['_' + key] = def[key];
  }

  this.map[method].push(route);

  namedRoutes[def['as']] = route;

  return ret;
};

function reversePath(path, args, query, trailing_slash) {

  if (!args){
    args = {};
  }

  var reversed = path.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g,
    function(part, slash, format, key, capture, optional, star) {

      if (args[key]) {
        var arg = args[key];

        delete args[key];

        return '/' + arg;
      }

      if (!args[key] && optional) {
        delete args[key];

        return '';
      }

      throw new Error('Cannot reverse the route path "' + path +
        '", missing value for "' + key + '" parameter.');
    });

  // with the trailing slash
  if (trailing_slash) {
    if (reversed.charAt(reversed.length - 1) != '/') {
      reversed += '/';
    }

    // without trailing slash
  } else if (reversed.charAt(reversed.length - 1) == '/') {
    reversed = reversed.slice(0, -1);
  }

  // if append query
  if (query) {

    var append = [];

    // if append only given query string
    if (typeof query == 'string') {

    	// indexed array of param=value
      query = query.split('&');

      var seg;
      for (var i in query) {

        seg = query[i].split('=');

        append.push(seg[0] + '=' + seg[1]);
      }

      // only append given query object (array like)
    } else if (typeof query == 'object') {

      for (var param in query) {
        append.push(param + '=' + query[param]);
      }

      // only append given args
    } else {

      for (var param in args) {
        append.push(param + '=' + args[param]);
      }
    }

    if (append.length) {
      reversed += '?' + append.join('&');
    }
  }

  return reversed;
}

function getNamedRoute(name) {

  if (undefined === namedRoutes[name]){
    throw new Error('The route name "' + name + '" is not defined.');
  }

  return namedRoutes[name];
}

function getNamedRoutes() {
  return namedRoutes;
}

// check if is an absolute URL
function isAbsoluteUrl(str) {
  return /^([a-z]+\:\/\/|\/\/)+/gi.test(str);
}

function url(name, args, trailing_slash) {

  var path = reversePath(
    getNamedRoute(name)['path'], 
    args, 
    false,
    trailing_slash
  );

  if (isAbsoluteUrl(path)){
    return path;
  }

  return base_url + path;
}

function uri(name, args, trailing_slash) {

  var path = reversePath(
    getNamedRoute(name)['path'], 
    args, 
    false,
    trailing_slash
  );

  if (isAbsoluteUrl(path)){
    return path.substr(base_url.length);
  }

  return path;
}

function fullUrl(name, args, query, trailing_slash) {

  if (!query){
    query = true;
  }

  var path = reversePath(
    getNamedRoute(name)['path'], 
    args, 
    query,
    trailing_slash
  );

  if (isAbsoluteUrl(path)){
    return path;
  }

  return base_url + path;
}

function fullUri(name, args, query, trailing_slash) {

  if (!query){
    query = true;
  }

  var path = reversePath(
    getNamedRoute(name)['path'], 
    args, 
    query,
    trailing_slash
  );

  if (isAbsoluteUrl(path)){
    return path.substr(base_url.length);
  }

  return path;
}


// @todo resource

// @todo resourceUrl (useful for remote API)

// @todo namespace

// expose
module.exports = function Application(noder_instance) {

  require('debug')('noder:application')(
  	'booting application in ' + noder_instance.conf.get('env') + ' mode'
  );

  noder = noder_instance;
  app 	= noder.express();

  var port = noder.conf.get('port');

  app.set('port', port);

  // MiddleWare
  // ----------

  // The dispatcher is the main component exposed in the middleware for Connect.
  // It sits in middleware stack (at the top before the app.router middleware) 
  // and waits for incomming requests, it hands the "next()" middleware.
  app.use(function(req, res, next) {
    
    port = app.get('port');

    if(port === undefined){
      throw new Error('The port is undefined.')
    }

    // Give locals and request patches

    res._headers['x-powered-by'] = 'Express, Noder.io';

    Object.defineProperty(req, 'noder', {
      value: {}
    });

    res.locals.__base_url 
    	= req.noder.base_url = req.protocol + '://' + req.host + 
        ((port == 80 || port == 443) ? '' : ':' + port);

    res.locals.__fullUrl 
    	= req.noder.fullUrl = req.noder.base_url + req.originalUrl;

    res.locals.__fullUri 
    	= req.noder.fullUri = req.originalUrl;

    res.locals.__parsedUrl 
    	= req.noder.parsedUrl = urlParser.parse(req.noder.fullUrl);

    res.locals.__uri 
    	= req.noder.uri = req.noder.parsedUrl.pathname;

    res.locals.__url 
    	= req.noder.url = req.noder.base_url + req.noder.uri;

    res.locals.__query_string 
    	= req.noder.query_string = req.noder.parsedUrl.query;

    res.locals.__query 
    	= req.noder.query = req.query;

    base_url = req.noder.base_url;

    next();
  });

  // router middleware
  app.use(app.router);

  // augments
  app.base_url          = base_url;

  app.url               = url;
  app.uri               = uri;
  app.fullUrl           = fullUrl;
  app.fullUri           = fullUrl;
  app.reversePath       = reversePath;

  app.isAbsoluteUrl     = isAbsoluteUrl;
  app.getNamedRoute     = getNamedRoute;
  app.getNamedRoutes    = getNamedRoutes;

  return app;
};