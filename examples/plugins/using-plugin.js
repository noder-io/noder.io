'use strict';

var Noder       = require('noder.io').Noder;
var helloPlugin = require('./hello-plugin');

var api = new Noder();
var result;

api.$di.set('log', function(data) {
  console.log(data);
});

// use helloPlugin
api.use(helloPlugin);

// literal
result = api.$di.get('helloFactory');

console.log(result);

// function
result = api.$invoke('helloFactory', function(hello) {
  return hello;
});

console.log(result);

result = api.$invoke(['helloFactory', 'description'], function(hello, desc) {
  return hello + ' description: ' + desc;
});

console.log(result);

result = api.$invoke(['$di', 'helloProvider'], function($di, hello) {

  $di.set('question', 'You saw where the question has been replaced?');

  return hello('You!');
});

console.log(result);