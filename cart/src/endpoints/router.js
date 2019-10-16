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
   * All HTTP POST route definitions
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routePost(server) {
    server.route([
      {
        method: 'POST',
        path: `/cart/{id}`,
        handler: this.handlers.addProduct.bind(this.handlers),
        config: {
          description: `Add a product to the cart.`,
          tags: ['api', 'cart'],
          plugins: {
            'hapi-swagger': {
              201: { description: 'Product added' },
              400: { description: 'Bad request (e.g. body empty)' }
            }
          }
        }
      }
    ]);
  }

  /**
   * All HTTP PUT route definitions
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routePut(server) {
    server.route([
      {
        method: 'PUT',
        path: `/cart/{id}/remove`,
        handler: this.handlers.removeProduct.bind(this.handlers),
        config: {
          description: 'Remove a product from the cart.',
          tags: ['api', 'cart'],
          plugins: {
            'hapi-swagger': {
              200: { description: 'Product removed'},
              400: { description: 'Bad request (e.g. body empty)' }
            }
          }
        }
      },
      {
        method: 'PUT',
        path: '/cart/{id}/empty',
        handler: this.handlers.emptyCart.bind(this.handlers),
        config: {
          description: 'Empty the cart, removing all products (but does not remove the cart).',
          tags: ['api', 'cart'],
          plugins: {
            'hapi-swagger': {
              200: { description: 'Cart cleared' },
              400: { description: 'Bad request.' }
            }
          }
        }
      },
      {
        method: 'PUT',
        path: '/cart/{id}',
        handler: this.handlers.changeAmount.bind(this.handlers),
        config: {
          description: 'Change the amount of product in the cart.',
          tags: ['api', 'cart'],
          plugins: {
            'hapi-swagger': {
              200: { description: 'Amount updated' },
              400: { description: 'Bad request' }
            }
          }
        }
      }
    ]);
  }

   /**
   * All HTTP GET route definitions
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeGet(server) {
    server.route([
      {
        method: 'GET',
        path: `/cart/{id}`,
        handler: this.handlers.getProducts.bind(this.handlers),
        config: {
          description: 'Get all products in a cart.',
          tags: ['api', 'cart'],
          plugins: {
            'hapi-swagger': {
              200: { description: 'Product listing returned' },
              400: { description: 'Bad request' }
            }
          }
        }
      }
    ]);
  }
   /**
   * All HTTP DELETE route definitions
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeDelete(server) {
    server.route([
      {
        method: 'DELETE',
        path: '/cart/{id}',
        handler: this.handlers.deleteCart.bind(this.handlers),
        config: {
          description: 'Clear and delete the cart.',
          tags: ['api', 'cart'],
          plugins: {
            'hapi-swagger': {
              200: { description: 'Cart deleted' },
              400: { desription: 'Bad request' }
            }
          }
        }
      }
    ])
  }


  /**
   * Actually adds the routes to the server
   * @param {Hapi.server} server - the Hapi server
   */
  route(server) {
    this.routeGet(server);
    this.routePost(server);
    this.routePut(server);
    this.routeDelete(server);
  }
}

module.exports = Router;
