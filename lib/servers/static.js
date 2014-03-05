var noder   = require('../../');
var path    = require('path');
var fs      = require('fs');
var app     = noder.app;
var express = noder.express;

module.exports = function(rootPath, debug) {

  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }

  if(!rootPath){

    // path by default
    rootPath = path.resolve('public');
  }else{

    // resolve relative path
    rootPath = path.resolve(rootPath);
  }

  if(!fs.existsSync(rootPath)){
    throw new Error('Root path is not found ' + rootPath);
  }

  if(debug){
    app.use(express.logger('dev'));
  }

  app.use(express.static(rootPath));

  app.listen(app.get('port'), function(){
    console.log('Noder.io: server "static" listening on port ' + app.get('port'));
    console.log('Static path: ' + rootPath);
  });
};