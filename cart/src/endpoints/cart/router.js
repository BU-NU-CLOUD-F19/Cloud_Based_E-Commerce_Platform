/**
 * This class defines all the custom routes in addition to the base routes
 * for `cart` resource
 */

const BaseRouter = require('../base-router');

const Handlers = require('./handlers');

const resource = require('../../constants/modelNames').cart;

class Router extends BaseRouter {
  constructor(handler) {
    const h = handler || new Handlers();
    super(resource, h);
  }

  // add all the resource specific routes here

  // route:  /cart/a/b/c/d
}

module.exports = Router;
