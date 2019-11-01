/**
 * This class sets the hapi routes for the `auth-token` resource
 * (https://github.com/hapijs/glue)
 */

'use strict';

const Router = require('./router');

const resource = 'auth-token';


/**
 * Create the register function for the Hapi plugin
 */
module.exports.register = (server, options) => {
  new Router(options).route(server);
};
module.exports.name = resource;
