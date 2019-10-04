/**
 * This class sets the hapi routes for the `shopping_cart` resource
 * (https://github.com/hapijs/glue)
 */

'use strict';

const Router = require('./router');
const Names = require('../../constants/modelNames');

const resource = Names.shopping_cart;


module.exports.register = (server, options) => {
  new Router(null, options).route(server);
};
module.exports.name = resource;
