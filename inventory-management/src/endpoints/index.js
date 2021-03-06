/**
 * This class sets the hapi routes for the `inventory-management` resource
 * (https://github.com/hapijs/glue)
 */

'use strict';

const Router = require('./router');
const Names = require('../constants/modelNames');

const resource = Names.inventory;  // TO-DO add varible to import as Names.

/**
 * Create the register function for the Hapi plugin
 */
module.exports.register = (server, options) => {
    new Router(null, options).route(server);
};
module.exports.name = resource;