'use strict';

function main() {

  var api = noder.createNoder();
  var result1;
  var result2;

  api.$di.set('demo', {
    name: 'Noder.io - Browser example'
  });

  api.$di.addAll({
    a: 'a value',
    b: 'b value'
  });

  result1 = api.$invoke(['a', 'b', '$di'], function(a, b, $di) {

    console.log('---------');
    console.log('With $invoke()');
    console.log('api.$di.get(\'demo\'): ', api.$di.get('demo'));
    console.log('$invoke a function with dependencies:', a, b, $di);

    return '$invoke(): Returned value !';
  });

  result2 = api.$apply(function() {

    console.log('---------');
    console.log('With $apply()');
    console.log('this.demo: ', this.demo);
    console.log('$apply a function with dependencies:', this.a, this.b, this.$di);

    return '$apply(): Returned value !';
  });

  console.log('---------');
  console.log(result1);
  console.log(result2);
  console.log('---------');

  return api;
}