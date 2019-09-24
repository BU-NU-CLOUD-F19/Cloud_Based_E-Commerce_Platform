/**
 * This class defines all the custom routes in addition to the base routes
 * for `demo` resource
 */

const elv = require('elv');
const BaseRouter = require('../base-router');

const Handlers = require('./handlers');

const resource = require('../../configs/modelNames').demo;

class Router extends BaseRouter {
  constructor(handler) {
    const h = elv.coalesce(handler, () => new Handlers());
    super(resource, h);
  }
}

module.exports = Router;