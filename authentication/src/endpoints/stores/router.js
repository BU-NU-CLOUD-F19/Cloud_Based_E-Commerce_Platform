/**
 * The Router for the cart, contains all HTTP routes pertaining to cart actions and
 * links them to the corresponding handlers.
 */

'use strict';

// Handlers for the routes, triggered on request
const Handlers = require('./handlers.js');

/**
 * The Hapi router, creates HTTP routes
 */
class Router {
  /**
   * Constructor to create the class
   * @param {object} options - options passed to the router during registration in /registrations.js
   */
  constructor(options) {
    this.handlers = new Handlers();
  }

  /**
   * POST add product
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeAddStore(server) {
    server.route({
      method: 'POST',
      path: `/stores`,
      handler: this.handlers.addProduct.bind(this.handlers),
      config: {
        description: `Add a product to the cart.`,
        tags: ['api', 'authentication'],
        plugins: {
          'hapi-swagger': {
            201: { description: 'Store added' },
            400: { description: 'Bad request (e.g. body empty)' }
          }
        }
      }
    });
  }

  /**
   * PUT remove product
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeRemoveStore(server) {
    server.route({
      method: 'DELETE',
      path: `/stores/{id}`,
      handler: this.handlers.deleteStore.bind(this.handlers),
      config: {
        description: 'Remove a product from the cart.',
        tags: ['api', 'authentication'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'Product removed'},
            400: { description: 'Bad request (e.g. body empty)' }
          }
        }
      }
    })
  }

   /**
   * GET list the products in the cart
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeGetStore(server) {
    server.route({
      method: 'GET',
      path: `/stores/{id}`,
      handler: this.handlers.getStoreById.bind(this.handlers),
      config: {
        description: 'Get a store.',
        tags: ['api', 'authentication'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'Product listing returned' },
            400: { description: 'Bad request' }
          }
        }
      }
    });
  }

  /**
   * Actually adds the routes to the server
   * @param {Hapi.server} server - the Hapi server
   */
  route(server) {
    this.routeAddStore(server);
    this.routeRemoveStore(server);
    this.routeGetStore(server);
  }
}

module.exports = Router;
