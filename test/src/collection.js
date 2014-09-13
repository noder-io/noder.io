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
var $di   = noder.$di;


describe('noder.Collection', function(){

  it('Create an instance without values', function(){
    var collection = new noder.Collection;

    test
      .object(collection)
        .isInstanceOf(noder.Collection)

      .object(collection._container)
        .is({})
    ;

  });

  it('Create an instance with values', function(){

    var values = {k1:'v1', 'k2':2};
    var collection = new noder.Collection(values);

    test
      .object(collection)
        .isInstanceOf(noder.Collection)

      .object(collection._container)
        .isIdenticalTo(values)
        .is({k1:'v1', 'k2':2})
    ;
  });

  it('set()', function(){

    var collection = new noder.Collection();

    test
      .object(collection.set('foo', 'bar'))
        .isInstanceOf(noder.Collection)
        .isIdenticalTo(collection)

      .string(collection.get('foo'))
        .isIdenticalTo('bar')
    ;
  });

  it('get()', function(){

    var collection = new noder.Collection();

    test
      .object(collection.set('foo', 'bar'))

      .string(collection.get('foo'))
        .isIdenticalTo('bar')

      .undefined(collection.get('not exists'))

      .undefined(collection.get('not exists', function(){
        return undefined;
      }))

      .value(collection.get('not exists', null))
        .isNull()

      .value(collection.get('not exists', function(){
        return null;
      }))
        .isNull()

      .bool(collection.get('not exists', true))
        .isTrue()

      .bool(collection.get('not exists', function(){
        return true;
      }))
        .isTrue()

      .bool(collection.get('not exists', false))
        .isFalse()

      .bool(collection.get('not exists', function(){
        return false;
      }))
        .isFalse()

      .object(collection.get('not exists', {}))
        .is({})

      .object(collection.get('not exists', function(){
        return {};
      }))
        .is({})

      .string(collection.get('not exists', 'ok'))
        .isIdenticalTo('ok')

      .string(collection.get('not exists', function(){
        return 'ok';
      }))
        .isIdenticalTo('ok')

      .number(collection.get('not exists', function(){
        return 2;
      }))
        .isIdenticalTo(2)
    ;

  });

  it('getAll()', function(){

    var collection = new noder.Collection({k1:'v1', 'k2':2, 'k3':'v3'});

    test
      .object(collection._container)
        .is({k1:'v1', 'k2':2, 'k3':'v3'})
        .isIdenticalTo(collection.getAll())
    ;

  });

  it('keys()', function(){

    var collection = new noder.Collection({k1:'v1', 'k2':2, 'k3':'v3'});

    test
      .array(collection.keys())
        .is(['k1', 'k2', 'k3'])

      .if('Empty the container', collection.setAll({}))
        .array(collection.keys())
          .hasLength(0)
    ;

  });

  it('addOnce', function(){

    var collection = new noder.Collection({k1:'v1', 'k2':2, 'k3':'v3'});

    test
      .object(collection.addOnce('k4', 4))
        .isInstanceOf(noder.Collection)
        .isIdenticalTo(collection)

      .number(collection.get('k4'))
        .isIdenticalTo(4)
        .isIdenticalTo(collection._container.k4)
        .isIdenticalTo(collection._container['k4'])

      .case('without skip_if_exists', function(){

        test
          .error(function() {
            collection.addOnce('k4', 'other 4');
          })

          .then('Checks the key k4')
            .number(collection.get('k4'))
              .isIdenticalTo(4)
              .isIdenticalTo(collection._container.k4)
              .isIdenticalTo(collection._container['k4'])
        ;
      })

      .case('with skip_if_exists', function(){

        test
          .object(collection.addOnce('k4', 'other 4', true))
            .isInstanceOf(noder.Collection)
            .isIdenticalTo(collection)

          .then('Checks the key k4')

          .number(collection.get('k4'))
            .isIdenticalTo(4)
            .isIdenticalTo(collection._container.k4)
            .isIdenticalTo(collection._container['k4'])
        ;

      })

      .then('Checks the compliance of the keys')

      .array(collection.keys())
        .is(['k1', 'k2', 'k3', 'k4'])
    ;
  });

  it('addOnceAll()', function(){

    var collection = new noder.Collection({
      k1:'v1', 'k2':2, 'k3':'v3', k4: 4
    });

    test
      .error(function() {

        collection.addOnceAll();
      })
      .object(collection.addOnceAll({'k5': 5, 'k6': 6}))
        .isInstanceOf(noder.Collection)
        .isIdenticalTo(collection)

      .number(collection.get('k5'))
        .isIdenticalTo(5)
        .isIdenticalTo(collection._container.k5)
        .isIdenticalTo(collection._container['k5'])

      .number(collection.get('k6'))
        .isIdenticalTo(6)
        .isIdenticalTo(collection._container.k6)
        .isIdenticalTo(collection._container['k6'])

      .case('without skip_if_exists', function(){

        test
          .error(function() {
            collection.addOnceAll({'k5': 'other 5', 'k6': 'other 6', 'k7': 7});
          })

          .bool(collection.has('k7'))
            .isFalse()

          .undefined(collection.get('k7'))

          .then('Checks the compliance of the keys')
            .array(collection.keys())
              .is(['k1', 'k2', 'k3', 'k4', 'k5', 'k6'])

          .then('Checks the key k5')
            .number(collection.get('k5'))
              .isIdenticalTo(5)
              .isIdenticalTo(collection._container.k5)
              .isIdenticalTo(collection._container['k5'])

          .then('Checks the key k6')
            .number(collection.get('k6'))
              .isIdenticalTo(6)
              .isIdenticalTo(collection._container.k6)
              .isIdenticalTo(collection._container['k6'])

          .then('Checks the key k4')
            .number(collection.get('k4'))
              .isIdenticalTo(4)
              .isIdenticalTo(collection._container.k4)
              .isIdenticalTo(collection._container['k4'])
        ;
      })

      .case('with skip_if_exists', function(){

        test
          .object(collection.addOnceAll({
            'k5': 'other 5', 'k6': 'other 6', 'k7': 7
            }, true)
          )
            .isInstanceOf(noder.Collection)
            .isIdenticalTo(collection)

          .then('Checks the key k5')
            .number(collection.get('k5'))
              .isIdenticalTo(5)
              .isIdenticalTo(collection._container.k5)
              .isIdenticalTo(collection._container['k5'])

          .then('Checks the key k6')
            .number(collection.get('k6'))
              .isIdenticalTo(6)
              .isIdenticalTo(collection._container.k6)
              .isIdenticalTo(collection._container['k6'])

          .then('Checks the key k7')
            .number(collection.get('k7'))
              .isIdenticalTo(7)
              .isIdenticalTo(collection._container.k7)
              .isIdenticalTo(collection._container['k7'])

          .then('Checks the key k4')
            .number(collection.get('k4'))
              .isIdenticalTo(4)
              .isIdenticalTo(collection._container.k4)
              .isIdenticalTo(collection._container['k4'])
        ;
      })

      .then('Checks the compliance of the keys')
        .array(collection.keys())
          .is(['k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7'])
    ;
  });

  it('merge()', function() {
    var collection = new noder.Collection({
      k1:'v1', k2:2, k3: {
        a: { aa: { saa: 'vaa', saa2: 'vaa2' } }
      }
    });

    var values = {
        k2: 'replace 2',
        k3: {
        a: { aa: { saa: 'replace vaa'} },
        b: 'b added'
      },
      k4: 4
    };

    test
      .object(collection.merge(values))
        .isInstanceOf(noder.Collection)
        .isIdenticalTo(collection)

      .array(collection.keys())
        .is(['k1', 'k2', 'k3', 'k4'])

      .object(collection.getAll())
        .is({
          k1: 'v1',
          k2: 'replace 2',
          k3: {
          a: { aa: { saa: 'replace vaa', saa2: 'vaa2' } },
          b: 'b added'
        },
        k4: 4
      })
        .isIdenticalTo(collection._container)
    ;

  });

  it('has()', function(){

    var collection = new noder.Collection({
      k1:'v1', k2:2
    });

    test
      .error(function() {
        collection.has();
      })

      .bool(collection.has('k1'))
        .isTrue()

      .bool(collection.has('k2'))
        .isTrue()

      .bool(collection.has('k3'))
        .isFalse()
    ;
  });

  it('remove()', function(){

    var collection = new noder.Collection({
      k1: 'v1', k2: 2, k3: 'v3', k4: 4, k5: 5
    });

    test
      .error(function() {
        collection.remove();
      })

      .object(collection.getAll())
        .hasKey('k2')

      .object(collection.remove('k2'))
        .isInstanceOf(noder.Collection)
        .isIdenticalTo(collection)

      .object(collection.getAll())
        .notHasKey('k2')

      .then('Checks the compliance of the keys')
        .array(collection.keys())
          .is(['k1', 'k3', 'k4', 'k5'])

      .when('Remove a service')
        .object(collection.provider('k6', collection.wrap('k6 val')))
          .isInstanceOf(noder.Collection)
          .isIdenticalTo(collection)

        .bool(collection.has('k6'))
          .isTrue()

        .object(collection.remove('k6'))
          .isInstanceOf(noder.Collection)
          .isIdenticalTo(collection)

        .bool(collection.has('k6'))
          .isFalse()
    ;
  });

  it('addAll()', function(){

    var collection = new noder.Collection({
      k1: 'v1', k2: 2, k3: 'v3', k4: 4, k5: 5
    });

    test
      .error(function() {
        collection.addAll();
      })
      .object(collection.addAll({
        'k4': 'replace 4', 'k5': 'replace 5', 'k6': 'add 6'
      }))
        .isInstanceOf(noder.Collection)
        .isIdenticalTo(collection)

      .string(collection.get('k4'))
        .isIdenticalTo('replace 4')

      .string(collection.get('k5'))
        .isIdenticalTo('replace 5')

      .string(collection.get('k6'))
        .isIdenticalTo('add 6')

      .then('Checks the compliance of the keys')
        .array(collection.keys())
          .is(['k1', 'k2', 'k3', 'k4', 'k5', 'k6'])
    ;
  });

  it('setAll()', function(){

    var collection = new noder.Collection({k1: 'v1'});

    test
      .error(function() {
        collection.setAll();
      })

      .object(collection.setAll({'k1': 'new 1', 'k2': 'new 2'}))
        .isInstanceOf(noder.Collection)
        .isIdenticalTo(collection)

      .then('Checks the compliance of the keys')
        .array(collection.keys())
          .is(['k1', 'k2'])

      .object(collection.getAll())
        .is({'k1': 'new 1', 'k2': 'new 2'})
        .isIdenticalTo(collection._container)

      .object(collection.setAll({}))
        .isInstanceOf(noder.Collection)
        .isIdenticalTo(collection)

      .object(collection.getAll())
        .is({})
        .isIdenticalTo(collection._container)

      .then('Checks keys()')
        .array(collection.keys())
          .hasLength(0)
    ;
  });

  it('raw()', function(){

    var collection = new noder.Collection();

    test
      .given(collection.set('key', 'value'))
        .string(collection.raw('key'))
          .isIdenticalTo('value')

      .given(collection.set('key', function(){
        return 'value';
      }))
        .function(collection.raw('key'))

      .string(collection.raw('key')())
        .isIdenticalTo('value')

      .function(collection.raw('not exists', function(){
        return 'default value';
      }))

      .string(collection.raw('not exists', function(){
        return 'default value';
      })())
        .isIdenticalTo('default value')

      .string(collection.raw('not exists', 'default value'))
        .isIdenticalTo('default value')

      .error(function() {

        collection.raw('not exists', function(){
          return 'default value';
        }, true);
      })

      .error(function() {

        collection.raw('not exists', function(){
          return 'default value';
        }, true)();

      })

      .error(function() {
        collection.raw('not exists', 'default value', true);
      })
    ;

  });

  it('apply()', function() {

    var collection = new noder.Collection();

    var checkScope = function() {
      return this;
    };

    var checkReturn = function() {

      test.object(this)
        .isIdenticalTo(collection._container);

      return 2;
    };

    var checkArgs = function() {

      test
        .string(arguments[0])
          .isIdenticalTo('arg 1')

        .string(arguments[1])
          .isIdenticalTo('arg 2')
      ;

      return this;
    };

    var checkArgsAndReturn = function() {

      test
        .string(arguments[0])
          .isIdenticalTo('arg 1')

        .string(arguments[1])
          .isIdenticalTo('arg 2')
      ;

      return 'ok';
    };

    test
      .undefined(checkScope())

      .object(collection.apply(checkScope))
        .isIdenticalTo(collection._container)

      .number(collection.apply(checkReturn))
        .isIdenticalTo(2)

      .object(collection.apply(checkArgs, 'arg 1', 'arg 2'))
        .isIdenticalTo(collection._container)

      .string(collection.apply(checkArgsAndReturn, 'arg 1', 'arg 2'))
        .isIdenticalTo('ok')
    ;
  });

  it('wrap()', function() {

    var collection = new noder.Collection();

    test
      .function(collection.wrap('item'))
        .hasName('wrapper')

      .string(collection.wrap('item')())
        .isIdenticalTo('item')

      .bool(collection.wrap(true)())
        .isTrue()
    ;
  });

  it('singleton()', function(){

    var collection = new noder.Collection();
    var count = 0;

    test
      .object(collection.singleton('count', function(v) {
        count += v;

        return count;
      }))
        .isInstanceOf(noder.Collection)
        .isIdenticalTo(collection)

      .number(collection.raw('count')(1))
        .isIdenticalTo(1)

      .number(collection.raw('count')(1))
        .isIdenticalTo(1)

      .error(function() {
        collection.singleton('is', 'bad');
      })

      .error(function() {
        collection.singleton(function(v) {
          return 'bad';
        });
      })

      .case('redefine, returns undefined', count = 0)
        .object(collection.singleton('count', function() {
          count++;
        }))
          .isInstanceOf(noder.Collection)
          .isIdenticalTo(collection)

        .undefined(collection.get('count'))
        .number(count)
          .isIdenticalTo(1)

        .undefined(collection.get('count'))
        .number(count)
          .isIdenticalTo(1)
    ;
  });

  it('invoke()', function(){

    var collection = new noder.Collection();

    test
      .given(collection.set('dep', function(){
        return 'I am dep';
      }))

      .case('call with one dependence defined as string')
        .string(collection.invoke('dep', function(arg1) {

          test
            .string(arg1)
              .isIdenticalTo('I am dep')

            .object(arguments)
                .hasLength(1)
          ;

          return arg1;
        }))
          .isIdenticalTo('I am dep')

      .case('call with one dependency defined as array')
        .if(collection.set('dep', function(){

          test.object(arguments).hasLength(0);

          return 'I am dep';
        }))
          .string(collection.invoke(['dep'], function(arg1) {
            test
              .string(arguments[0])
                .isIdenticalTo('I am dep')
                .isIdenticalTo(arg1)

              .object(arguments)
                .hasLength(1)
            ;

            return arg1;
          }))
            .isIdenticalTo('I am dep')

      .case('Return value')
        .string(collection.invoke(['dep'], function(arg1) {
          test
            .string(arguments[0])
              .isIdenticalTo('I am dep')
              .isIdenticalTo(arg1)

            .object(arguments)
              .hasLength(1)
          ;

          arg1 = 'Returned value';

          return arg1;
        }))
          .isIdenticalTo('Returned value')

      .case('call without arguments')
        .string(collection.invoke(function(){
          test
            .object(arguments)
              .hasLength(1)

            .object(arguments[0])
              .isIdenticalTo(collection._container)
          ;

          return 'handled by the first argument (deps) of invoke() method';

        }, function() {

          throw new Error(
            'The argument "fn" should not be called in this context'
          );
        }))
          .isIdenticalTo('handled by the first argument (deps) of invoke() method')

      .case('call with several dependencies defined', function() {
        collection.addAll({
          dep1: 'dep 1',
          dep2: 'dep 2',
          dep3: 'dep 3',
        });
      })
        .string(collection.invoke(['dep1', 'dep2', 'dep3'], function(dep1, dep2, dep3) {
          test
            .object(arguments)
              .hasLength(3)

            .string(dep1)
              .isIdenticalTo('dep 1')

            .string(dep2)
              .isIdenticalTo('dep 2')

            .string(dep3)
              .isIdenticalTo('dep 3')
          ;

          return 'ok';
        }))
          .isIdenticalTo('ok')
    ;
  });

  it('inject()', function(){

    var collection = new noder.Collection();

    test
      .given(collection.set('dep', function(){
        return 'I am dep';
      }))

      .case('call with one dependence defined as string')
        .function(collection.inject('dep', function(arg1) {
          test
            .function(arg1)
              .isIdenticalTo(collection.raw('dep'))

            .string(arg1())
              .isIdenticalTo('I am dep')

            .object(arguments)
                .hasLength(1)
          ;

          return arg1;
        }))
          .isIdenticalTo(collection.raw('dep'))

        .string(collection.get('dep'))
          .isIdenticalTo('I am dep')

      .case('call with one dependency defined as array')
        .if(collection.set('dep', function(){

          test.object(arguments).hasLength(0);

          return 'I am dep';
        }))
          .function(collection.inject(['dep'], function(arg1) {
            test
              .function(arguments[0])
                .isIdenticalTo(collection.raw('dep'))

              .string(arguments[0]())
                .isIdenticalTo('I am dep')
                .isIdenticalTo(arg1())

              .object(arguments)
                .hasLength(1)
            ;

            return arg1;
          }))
            .isIdenticalTo(collection.raw('dep'))

          .string(collection.get('dep'))
            .isIdenticalTo('I am dep')

      .case('Return value', function() {

        var interceptWrapper = noder.$wrap('Returned value');

        test
          .function(collection.inject(['dep'], function(arg1) {
            test
              .function(arguments[0])
                .isIdenticalTo(collection.raw('dep'))

              .string(arguments[0]())
                .isIdenticalTo('I am dep')
                .isIdenticalTo(arg1())

              .object(arguments)
                .hasLength(1)
            ;

            return interceptWrapper;
          }))
            .isIdenticalTo(interceptWrapper)
            .isNotIdenticalTo(collection.raw('dep'))

          .string(interceptWrapper())
            .isIdenticalTo('Returned value')
        ;
      })

      .case('call without arguments')
        .string(collection.inject(function(){
          test
            .object(arguments)
              .hasLength(1)

            .object(arguments[0])
              .isIdenticalTo(collection._container)
          ;

          return 'handled by the first argument (deps) of inject() method';

        }, function() {

          throw new Error(
            'The argument "fn" should not be called in this context'
          );
        }))
          .isIdenticalTo('handled by the first argument (deps) of inject() method')

      .case('call with several dependencies defined', function() {
        collection.addAll({
          dep1: 'dep 1',
          dep2: 'dep 2',
          dep3: 'dep 3',
        });
      })
        .string(collection.inject(['dep1', 'dep2', 'dep3'], function(dep1, dep2, dep3) {
          test
            .object(arguments)
              .hasLength(3)

            .string(dep1)
              .isIdenticalTo('dep 1')

            .string(dep2)
              .isIdenticalTo('dep 2')

            .string(dep3)
              .isIdenticalTo('dep 3')
          ;

          return 'ok';
        }))
          .isIdenticalTo('ok')
    ;
  });

  it('provider()', function(){

    var dic   = new noder.Collection();
    var dep1  = 'dep 1';
    var dep2  = dic.wrap('dep 2');
    var count = 0;

    dic.setAll({
      dep1: dep1,
      dep2: dep2
    });

    test
      .case('singleton, deps = raw values')
        .object(dic.provider('collProvider', ['dep1', 'dep2'], function(d1, d2) {

          count++;

          test
            .string(d1)
              .isIdenticalTo(dep1)

            .function(d2)
              .isIdenticalTo(dep2)
          ;

          return {
            value: 'ok' + count,
            count: function() {
              count++;
              return count;
            }
          };
        }))
          .isIdenticalTo(dic)

        .string(dic.get('collProvider').value)
          .isIdenticalTo('ok1')

        .string(dic.get('collProvider').value)
          .isIdenticalTo('ok1')

        .number(dic.get('collProvider').count())
          .isIdenticalTo(2)

      // undefined returned * 2 for testing singleton
      .case('redefine', count = 0)
        .object(dic.provider('collProvider', ['dep1', 'dep2'], function(d1, d2) {

          count++;

          test
            .string(d1)
              .isIdenticalTo(dep1)

            .function(d2)
              .isIdenticalTo(dep2)
          ;
        }))
      	  .isIdenticalTo(dic)

        .undefined(dic.get('collProvider'))
        .number(count)
          .isIdenticalTo(1)

        .undefined(dic.get('collProvider'))
        .number(count)
          .isIdenticalTo(1)

      .case('without dependencies', count = 0)
        .object(dic.provider('collProvider', function(container) {

          test
            .object(container)
              .isIdenticalTo(dic._container)
          ;
        }))
          .isIdenticalTo(dic)
    ;
  });

  it('factory()', function(){

    var dic   = new noder.Collection();
    var dep1  = 'dep 1';
    var dep2  = dic.wrap('dep 2');
    var count = 0;

    dic.setAll({
      dep1: dep1,
      dep2: dep2
    });

    test
      .case('singleton, deps = returned values')
        .object(dic.factory('collFactory', ['dep1', 'dep2'], function(d1, d2) {

          count++;

          test
            .string(d1)
              .isIdenticalTo(dep1)

            .string(d2)
              .isIdenticalTo('dep 2')
          ;

          return {
            value: 'ok' + count,
            count: function() {
              count++;
              return count;
            }
          };
        }))
          .isIdenticalTo(dic)

        .string(dic.get('collFactory').value)
          .isIdenticalTo('ok1')

        .string(dic.get('collFactory').value)
          .isIdenticalTo('ok1')

        .number(dic.get('collFactory').count())
          .isIdenticalTo(2)

      // undefined returned * 2 for testing singleton
      .case('redefine', count = 0)
        .object(dic.factory('collFactory', ['dep1', 'dep2'], function(d1, d2) {

          count++;

          test
            .string(d1)
              .isIdenticalTo(dep1)

            .string(d2)
              .isIdenticalTo('dep 2')
          ;
        }))
          .isIdenticalTo(dic)

        .undefined(dic.get('collFactory'))
        .number(count)
          .isIdenticalTo(1)

        .undefined(dic.get('collFactory'))
        .number(count)
          .isIdenticalTo(1)

      .case('without dependencies', count = 0)
        .object(dic.factory('collFactory', function(container) {

          test
            .object(container)
              .isIdenticalTo(dic._container)
          ;
        }))
          .isIdenticalTo(dic)
    ;
  });

}); // end: Collection
