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

var noder = require('../../src/index');
var test  = require('unit.js');

describe('Noder', function(){

  it('Instance', function(){
    test.object(noder)
      .isInstanceOf(noder.Noder);
  });

  it('createNoder()', function(){
    test
      .object(noder.createNoder())
        .isInstanceOf(noder.Noder)
        .isNotIdenticalTo(noder)
      ;
  });

  describe('use()', function() {

    it('string without arguments', function() {

      var api = new noder.Noder();

      api.$di.set('initialItem', 'initial item from noder');

      test
        .object(api.use(__dirname + '/../fixtures/noder-plugin'))
          .isInstanceOf(noder.Noder)
          .isNotIdenticalTo(noder)
          .isIdenticalTo(api)

        .string(api.$di.get('initialItem'))
          .isIdenticalTo('initial item modified by noderPlugin')

        .string(api.$di.get('pluginItem'))
          .isIdenticalTo('item added by noderPlugin')
      ;
    });

    it('string with arguments', function() {

      var api = new noder.Noder();

      api.$di.set('initialItem', 'initial item from noder');

      test
        .object(api.use(__dirname + '/../fixtures/noder-plugin', 'a', 'b'))
          .isInstanceOf(noder.Noder)
          .isNotIdenticalTo(noder)
          .isIdenticalTo(api)

        .string(api.$di.get('initialItem'))
          .isIdenticalTo('initial item modified by noderPlugin')

        .string(api.$di.get('pluginItem'))
          .isIdenticalTo('item added by noderPlugin')

        .object(api.$di.get('args'))
          .isArguments()

        .object(api.$di.get('args')['0'])
          .isInstanceOf(noder.Noder)
          .isIdenticalTo(api)

        .string(api.$di.get('args')['1'])
          .isIdenticalTo('a')

        .string(api.$di.get('args')['2'])
          .isIdenticalTo('b')
      ;
    });

    it('function without arguments', function() {

      var api = new noder.Noder();

      api.$di.set('initialItem', 'initial item from noder');

      test
        .object(api.use(require('../fixtures/noder-plugin')))
          .isInstanceOf(noder.Noder)
          .isNotIdenticalTo(noder)
          .isIdenticalTo(api)

        .string(api.$di.get('initialItem'))
          .isIdenticalTo('initial item modified by noderPlugin')

        .string(api.$di.get('pluginItem'))
          .isIdenticalTo('item added by noderPlugin')
      ;
    });

    it('function with arguments', function() {

      var api = new noder.Noder();

      api.$di.set('initialItem', 'initial item from noder');

      test
        .object(api.use(require('../fixtures/noder-plugin'), 'a', 'b'))
          .isInstanceOf(noder.Noder)
          .isNotIdenticalTo(noder)
          .isIdenticalTo(api)

        .string(api.$di.get('initialItem'))
          .isIdenticalTo('initial item modified by noderPlugin')

        .string(api.$di.get('pluginItem'))
          .isIdenticalTo('item added by noderPlugin')

        .object(api.$di.get('args'))
          .isArguments()

        .object(api.$di.get('args')['0'])
          .isInstanceOf(noder.Noder)
          .isIdenticalTo(api)

        .string(api.$di.get('args')['1'])
          .isIdenticalTo('a')

        .string(api.$di.get('args')['2'])
          .isIdenticalTo('b')
      ;
    });
  });

  describe('noder.createCollection() and noder.Collection', function(){

    it('Create a collection without values', function(){

      var collection = noder.createCollection();

      test
        .object(collection)
          .isInstanceOf(noder.Collection)

        .object(collection._container)
          .is({})
      ;
    });

    it('Create a collection with values', function(){

      var values = {k1:'v1', 'k2':2};
      var collection = noder.createCollection(values);

      test
        .object(collection)
          .isInstanceOf(noder.Collection)

        .object(collection._container)
          .isIdenticalTo(values)
          .is({k1:'v1', 'k2':2})
      ;
    });
  }); // end: Collection

  describe('noder.$inject', function() {

    it('Inject the predefined dependencies', function() {

      testInjectionWithDep('$inject');
    });

    it('Without defined dependencies, '
        + 'should pass only $container', function() {

      testInjectionWithoutDep('$inject');
    });
  });

  describe('noder.$invoke', function() {

    it('Inject the predefined dependencies', function() {

      testInjectionWithDep('$invoke');
    });

    it('Without defined dependencies, '
        + 'should pass only $container', function() {

      testInjectionWithoutDep('$invoke');
    });
  });

  describe('noder.$provider and noder.$factory', function() {

    it('Create provider', function() {

      var dep1 = 'dep 1';
      var dep2 = noder.$wrap('dep 2');

      noder.$di.setAll({
        dep1: dep1,
        dep2: dep2
      });

      test
        .object(noder.$provider('testProvider', ['dep1', 'dep2'], function(d1, d2){
          test
            .string(d1)
              .isIdenticalTo(dep1)

            .function(d2)
              .isIdenticalTo(dep2)
          ;

          return 'ok';
        }))
          .isIdenticalTo(noder)

        .string(noder.$di.get('testProvider'))
          .isIdenticalTo('ok')
      ;
    });

    it('Create factory', function() {

      var dep1 = 'dep 1';
      var dep2 = noder.$wrap('dep 2');

      noder.$di.setAll({
        dep1: dep1,
        dep2: dep2
      });

      test
        .object(noder.$factory('testFactory', ['dep1', 'dep2'], function(d1, d2){
          test
            .string(d1)
              .isIdenticalTo(dep1)

            .string(d2)
              .isIdenticalTo('dep 2')
          ;

          return 'ok';
        }))
          .isIdenticalTo(noder)

        .string(noder.$di.get('testFactory'))
          .isIdenticalTo('ok')
      ;
    });
  });

  describe('noder.$require', function(){


    it('Lazy loading', function(){

      test
        .object(noder.$require('unit.js'))
          .isIdenticalTo(noder)
          .isInstanceOf(noder.Noder)

        .bool(noder.$require.isLoaded('unit.js'))
            .isFalse()

        .if(noder['unit.js'])
          .bool(noder.$require.isLoaded('unit.js'))
            .isTrue()

          .object(noder['unit.js'])
            .isIdenticalTo(require('unit.js'))
      ;
    });

    it('Lazy loading in another object', function(){

      var obj = {
        a: undefined
      };

      test
        .object(noder.$require('unit', 'unit.js', obj))
          .isIdenticalTo(noder)
          .isInstanceOf(noder.Noder)

        .bool(noder.$require.isLoaded('unit', obj))
            .isFalse()

        .if(obj.unit)
          .bool(noder.$require.isLoaded('unit', obj))
            .isTrue()

          .object(obj.unit)
            .isIdenticalTo(require('unit.js'))
      ;
    });

    it('Lazy loading in a property', function(){

      var obj = {
        a: {}
      };

      test
        .object(noder.$require('unit', 'unit.js', obj.a))
          .isIdenticalTo(noder)
          .isInstanceOf(noder.Noder)

        .bool(noder.$require.isLoaded('unit', obj.a))
            .isFalse()

        .if(obj.a.unit)
          .bool(noder.$require.isLoaded('unit', obj.a))
            .isTrue()

          .object(obj.a.unit)
            .isIdenticalTo(require('unit.js'))
      ;
    });

    it('Custom loader', function() {

      var spy = test.spy();

      test
        .given(noder.$di.set('customLoaderDep', true))
        .case('define a custom loader')
          .object(noder.$require('coll', function() {
            spy();

            test
              .object(this)
                .isIdenticalTo(noder.$di._container)

              .bool(this.customLoaderDep)
                .isTrue()
            ;

            return require('../../src/collection');
          }))
            .isIdenticalTo(noder)
            .isInstanceOf(noder.Noder)

          .then('should be not loaded')
            .bool(spy.called)
              .isFalse()

        .case('use the lazy loaded module')
          .function(noder.coll)
            .hasName('Collection')
            .is(noder.Collection)
            .isIdenticalTo(require('../../src/collection'))

          .then('should be loaded with the custom loader')
            .bool(spy.calledOnce)
              .isTrue()

        .case('reuse the lazy loaded module')
          .function(noder.coll)
            .hasName('Collection')
            .is(noder.Collection)
            .isIdenticalTo(require('../../src/collection'))

          .then('should be a singleton')
            .bool(spy.calledOnce)
              .isTrue()
      ;
    });
  });
});


/*----------------------------------------------------------------------------*\
  Utils
\*----------------------------------------------------------------------------*/

function testInjectionWithDep(injector) {

  var deps = [
    '$api',
    '$di',
    '$container',
    '$invoke',
    '$inject',
    '$provider',
    '$factory',
    '$singleton',
    '$apply',
    '$wrap'
  ];

  test
    .string(noder[injector](deps, function($api, $di, $container, $invoke, $inject, $provider,
                                           $factory, $singleton, $apply, $wrap) {

        if(injector === '$inject') {

          // $noder is an object (not wrapped)
          $invoke    = $invoke();
          // $di is an object (not wrapped)
          $inject    = $inject();
          $provider  = $provider();
          $factory   = $factory();
          $singleton = $singleton();
          $apply     = $apply();
          $wrap      = $wrap();
        }

        test
          .object(arguments)
            .hasLength(deps.length)

          .object($api)
            .isIdenticalTo(noder)
            .isInstanceOf(noder.Noder)

          .object($di)
            .isIdenticalTo(noder.$di)
            .isInstanceOf(noder.Collection)

          .object($container)
            .isIdenticalTo(noder.$di._container)

          .function($invoke)
            .isIdenticalTo(noder.$invoke)

          .function($inject)
            .isIdenticalTo(noder.$inject)

          .function($provider)
            .isIdenticalTo(noder.$provider)

          .function($factory)
            .isIdenticalTo(noder.$factory)

          .function($singleton)
            .isIdenticalTo(noder.$singleton)

          .function($apply)
            .isIdenticalTo(noder.$apply)

          .function($wrap)
            .isIdenticalTo(noder.$wrap)
        ;

        return 'ok';
    }))
      .isIdenticalTo('ok')
  ;
}

function testInjectionWithoutDep(injector) {
  test
    .string(noder[injector](function() {
      test
        .object(arguments)
          .hasLength(1)

        .object(arguments[0])
          .isIdenticalTo(noder.$di._container)
      ;

      return 'ok';
    }))
      .isIdenticalTo('ok')
  ;
}
