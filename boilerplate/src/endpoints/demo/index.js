// sets the hapi routes: https://github.com/hapijs/glue
// Guide: https://hapibook.jjude.com/book/plugins


'use strict';

const Router = require('./router');
const Names = require('../../../classNames');

const resource = Names.demo;


module.exports.register = (server, options, next) => {
  new Router(null, options).route(server);
  next();
};

module.exports.register.attributes = {
  name: resource,
  version: '1.0.0',
};
