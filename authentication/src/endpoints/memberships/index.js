/**
 * This class sets the hapi routes for the `memberships` resource
 * (https://github.com/hapijs/glue)
 */

'use strict';

const Router = require('./router');
const Names = require('../../constants/modelNames');

const resource = Names.memberships;


/**
 * Create the register function for the Hapi plugin
 */
module.exports.register = (server, options) => {
  new Router(options).route(server);
};
module.exports.name = resource;
