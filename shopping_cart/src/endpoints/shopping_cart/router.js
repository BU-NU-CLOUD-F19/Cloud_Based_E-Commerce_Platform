/**
 * This class defines all the custom routes in addition to the base routes
 * for `shopping_cart` resource
 */

const BaseRouter = require('../base-router');

const Handlers = require('./handlers');

const resource = require('../../constants/modelNames').shopping_cart;

class Router extends BaseRouter {
  constructor(handler) {
    const h = handler || new Handlers();
    super(resource, h);
  }

  // add all the resource specific routes here

  // route:  /shopping_cart/a/b/c/d
}

module.exports = Router;
