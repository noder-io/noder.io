# Noder.io

Noder.io is a light starter toolkit to start and organize quickly a project 
with Node.js.

Noder.io provides useful features through Node.js modules chosen for 
the performance and productivity gains.

  * In progress:
    * online documentation, API doc and tutorials (multilingual, french and english from the start)
    * starter kit for start quickly a project Node.js (without unnecessary overhead, nor imposed modules)
    * standalone and portable noder package


## Getting Started

Noder.io require node.js 0.10 or higher.

### Install noder

Via NPM :

```sh
npm install noder.io
```

or via GIT :

```sh
$ git clone git@github.com:noder-io/noder.io.git noder
$ cd noder
$ npm install
```

### Usage

```js
var 
  noder = require('noder.io'),

  // use noder application
  app = noder.app
;

// display the environment of execution
console.log(noder.conf.get('env'));

// named route
app.post({path: '/hello/:name', as:'hello'}, function(req, res){
  res.end('Hello ' + req.name);
});

// ...

```

Documentation in progress ...


## Testing

Noder is tested with [Unit.js](http://unitjs.com) and Mocha. 
Unit.js is a simple and intuitive unit testing framework for javascript.


### How to use

```sh
$ bin/test -h

  Usage: _mocha [debug] [options] [files]

  Commands:

    init <path>            initialize a client-side mocha setup at <path>

  Options:

    -h, --help                      output usage information
    -V, --version                   output the version number
    -r, --require <name>            require the given module
    -R, --reporter <name>           specify the reporter to use
    -u, --ui <name>                 specify user-interface (bdd|tdd|exports)
    -g, --grep <pattern>            only run tests matching <pattern>
    -i, --invert                    inverts --grep matches
    -t, --timeout <ms>              set test-case timeout in milliseconds [2000]
    -s, --slow <ms>                 "slow" test threshold in milliseconds [75]
    -w, --watch                     watch files for changes
    -c, --colors                    force enabling of colors
    -C, --no-colors                 force disabling of colors
    -G, --growl                     enable growl notification support
    -d, --debug                     enable node's debugger, synonym for node --debug
    -b, --bail                      bail after first test failure
    -A, --async-only                force all tests to take a callback (async)
    -S, --sort                      sort test files
    --recursive                     include sub directories
    --debug-brk                     enable node's debugger breaking on the first line
    --globals <names>               allow the given comma-delimited global [names]
    --check-leaks                   check for global variable leaks
    --interfaces                    display available interfaces
    --reporters                     display available reporters
    --compilers <ext>:<module>,...  use the given module(s) to compile files
    --inline-diffs                  display actual/expected differences inline within each string
    --no-exit                       require a clean shutdown of the event loop: mocha will not call process.exit

```

#### Example

```sh
# This will run all tests in the given directory
$ bin/test -d path/to/tests/directory
```

## Contributing

Contributions are welcome, you are welcome :)

## License

Copyright (c) 2014, Nicolas Tallefourtane.


BSD 2, see LICENSE file for more info.

## Author

| [![twitter/Nicolab_net](https://pbs.twimg.com/profile_images/1188191332/nico-snow-100x100_bigger.jpg)](https://twitter.com/Nicolab_net "Follow @Nicolab_net on Twitter") |
|---|
| [Nicolas Talle](http://nicolab.net) |
