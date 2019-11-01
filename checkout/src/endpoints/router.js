/**
 * The Router for the checkout service, contains all HTTP routes pertaining to checkout actions and
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

  routeBeginCheckout(server) {
    server.route({
      method: 'POST',
      path: `/checkout/{id}`,
      handler: this.handlers.beginCheckout.bind(this.handlers),
      config: {
        description: `Begin checkout for a cart.`,
        tags: ['api', 'checkout'],
        plugins: {
          'hapi-swagger': {
            201: { description: 'Checkout started.' },
            400: { description: 'Bad request' }
          }
        }
      }
    });
  }

  routeAbortCheckout(server) {
    server.route({
      method: 'DELETE',
      path: `/checkout/{id}`,
      handler: this.handlers.abortCheckout.bind(this.handlers),
      config: {
        description: `Abort a checkout process.`,
        tags: ['api', 'checkout'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'Checkout aborted.' },
            400: { description: 'Bad request' }
          }
        }
      }
    });
  }

  routeFinishCheckout(server) {
    server.route({
      method: 'PUT',
      path: `/checkout/{id}`,
      handler: this.handlers.abortCheckout.bind(this.handlers),
      config: {
        description: `Finish a checkout process.`,
        tags: ['api', 'checkout'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'Checkout complete.' },
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
    this.routeBeginCheckout(server);
    this.routeAbortCheckout(server);
    this.routeFinishCheckout(server);
  }
}

module.exports = Router;
