/**
 * This class sets the hapi routes for the `demo` resource
 * (https://github.com/hapijs/glue)
 */

'use strict';

const Router = require('./router');
const Names = require('../../constants/modelNames');

const resource = Names.demo;


module.exports.register = (server, options) => {
  new Router(null, options).route(server);
};
module.exports.name = resource;
