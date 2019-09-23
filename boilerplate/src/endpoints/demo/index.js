// sets the hapi routes: https://github.com/hapijs/glue
// Guide: https://hapibook.jjude.com/book/plugins


'use strict';

const Router = require('./router');
const Names = require('../../configs/classNames');

const resource = Names.demo;


module.exports.register = (server, options, ) => {
  new Router(null, options).route(server);
};
module.exports.name = resource;
