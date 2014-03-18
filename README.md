# Noder.io

[![Actual version published on NPM](https://badge.fury.io/js/noder.io.png)](https://www.npmjs.org/package/noder.io)
[![Dependencies](https://david-dm.org/noder-io/noder.io.png)](https://david-dm.org/noder-io/noder.io)

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

### Usage

```js
var noder = require('noder.io');

// display the environment of execution
console.log(noder.conf.get('env'));

// ...
```

## Modules

* noder.configurator:  convict
* noder.conf:          instance of noder.configuration
* noder.debug:         debug
* noder.logger:        winston
* noder.json:          cjson
* noder.mout:          mout
* noder._:             lodash
* noder._.str:         underscore.string
* noder.seq:           lazy
* noder.async:         async
* noder.q:             kew
* noder.promise:       bluebird
* noder.mixin:         mixing
* noder.compose:       compose
* noder.patch:         hooker
* noder.validation:    validatorjs
* noder.validator:     revalidator
* noder.check:         validator
* noder.moment:        moment
* noder.engines:       consolidate
* noder.socket:        socket.io
* noder.dom:           cheerio
* noder.swig:          swig
* noder.lang:          jus-i18n
* noder.markdown:      marked
* noder.commander:     commander
* noder.prompter:      inquirer
* noder.passport:      passport

## Testing

Noder is tested with [Unit.js](http://unitjs.com) and Mocha. 
Unit.js is a powerful and intuitive unit testing framework for javascript.


## See also

 * [noder.io-app](https://github.com/noder-io/noder.io-app) : Toolkit to start quickly an application with Node.js (it use express, a script loader, a router that support the named routes, ...).

## Contributing

Contributions are welcome, you are welcome :)

## License

Copyright (c) 2014, Nicolas Tallefourtane.


BSD 2, see LICENSE file for more info.

## Author

| [![Nicolas Tallefourtane - Nicolab.net](http://www.gravatar.com/avatar/d7dd0f4769f3aa48a3ecb308f0b457fc?s=64)](http://nicolab.net) |
|---|
| [Nicolas Talle](http://nicolab.net) |
| [![Support via Gittip](http://img.shields.io/gittip/Nicolab.svg)](https://www.gittip.com/Nicolab/) |
| [![Make a donation via Paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PGRH4ZXP36GUC) |
