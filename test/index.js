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

var noder = require('../index');
var test = require('unit.js');

describe('Noder', function(){

    it('Instance', function(){
      test.object(noder);
    });

    describe('Collection', function(){
      
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
      
      it('singleton()', function(){
        
        var collection = new noder.Collection();
        var counter = 0;

        test
          .object(collection.singleton('count', function(v) {
            counter = counter + v;

            return counter;
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
        ;
      });
      
      it('use()', function(){
       
        var collection = new noder.Collection();
        var dep;

        test
          .given(collection.set('dep', function(){
            return 'I am dep';
          }))

          .object(collection.use('dep', function(mod) {
            test
              .object(mod)
                .isInstanceOf(noder.Collection)
                .isIdenticalTo(collection)

              .object(arguments)
                  .hasLength(1)
            ;

            return mod;
          }))
            .isInstanceOf(noder.Collection)
            .isIdenticalTo(collection)

          .if(collection.set('dep', function(){

            test.object(arguments).hasLength(0);

            return 'I am dep';
          }))
            .string(collection.use(['dep'], function(mod) {
              test
                .string(arguments[0])
                  .isIdenticalTo('I am dep')
                  .isIdenticalTo(mod)

                .object(arguments[1])
                  .isInstanceOf(noder.Collection)
                  .isIdenticalTo(collection)

                .object(arguments)
                  .hasLength(2)
              ;

              return mod;
            }))
              .isIdenticalTo('I am dep')

            .string(collection.use(['dep'], function(mod) {
              test
                .string(arguments[0])
                  .isIdenticalTo('I am dep')
                  .isIdenticalTo(mod)

                .object(arguments[1])
                  .isInstanceOf(noder.Collection)
                  .isIdenticalTo(collection)

                .object(arguments)
                  .hasLength(2)
              ;

              mod = 'I am intercepted';

              return mod;
            }))
              .isIdenticalTo('I am intercepted')


            .string(collection.use(function(){ 
              test
                .object(arguments)
                  .hasLength(1)

                .object(arguments[0])
                    .isInstanceOf(noder.Collection)
                    .isIdenticalTo(collection)
              ;

              return 'handled by the dependency';

            }, function() {

              throw new Error(
                'The argument "module" should not be invoked in this context'
              );
            }))
              .isIdenticalTo('handled by the dependency')
        ;
      });
      
    }); // end: Collection

  describe('Modules', function(){

    it('List', function(){
      
    });

    it('Lazy loader', function(){
      
      test
          // Lazy loader
          .function(noder.mout.array.append)

            // ensure the lib is correct
            .isIdenticalTo(require('mout/array/append'))
      ;

    });

  });

  describe('Configuration', function(){

    it('conf', function(){
      
      var listEnv;
      var environments = [
        'production', 'development', 'test', 'stage', 'maintenance', 'degrad'
      ];

      test
        .object(noder.conf)

        .string(noder.conf.get('env'))
          .isNotEmpty()

        .string(noder.conf.get('env'))

        .given(noder.conf.set('custom_config', 'value config'))
          .string(noder.conf.get('custom_config'))
            .isIdenticalTo('value config')

        .given(noder.conf.validate())
          .string(noder.conf.get('custom_config'))
            .isIdenticalTo('value config')

        .error(function(){
          noder.conf.set('env', 'a invalid environment').validate(); 

          // without chaining
          noder.conf.validate();
        })

        .when(function(){

          listEnv = function () {

            environments.forEach(function(env) {

              noder.conf.set('env', env).validate();

              test
                .string(noder.conf.get('env'))
                  .isIdenticalTo(env)
              ;
            });
          };

        })
        .then(listEnv())
      ;

    });

    it('Configurator', function(){
      
      var config;

      test
        .value(noder.configurator)
          .isIdenticalTo(require('convict'))

        .given(config = noder.configurator({

          test: {
              doc: 'Test the new format.',
              format: ['v1', 'v2', 'v3'],
              default: 'v2'
          }

        }))

          // ensure is not a singleton of noder.conf
          .bool(config.has('env'))
            .isFalse()

          .given(config.set('custom_config', 'value config'))
            .string(config.get('custom_config'))
              .isIdenticalTo('value config')

          .given(config.validate())
            .string(config.get('custom_config'))
              .isIdenticalTo('value config')

          .bool(config.has('test'))
            .isTrue()

          .string(config.get('test'))
            .isIdenticalTo('v2')

          .given(config.set('test', 'v1'))
            .string(config.get('test'))
              .isIdenticalTo('v1')

          .given(config.set('test', 'v2'))
            .string(config.get('test'))
              .isIdenticalTo('v2')

          .given(config.set('test', 'v3'))
            .string(config.get('test'))
              .isIdenticalTo('v3')

          .then(config.validate())

          .error(function(){
            config.set('test', 'v4').validate();

            // without chaining
            config.validate();
          })
      ;
    });

  });
});
