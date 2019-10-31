/**
 * The Router for the cart, contains all HTTP routes pertaining to cart actions and
 * links them to the corresponding handlers.
 */

'use strict';

// Handlers for the routes, triggered on request
const Handlers = require('./handlers');

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
  routeAddMembership(server) {
    server.route({
      method: 'POST',
      path: `/memberships`,
      handler: this.handlers.addMembership.bind(this.handlers),
      config: {
        description: `Add a product to the cart.`,
        tags: ['api', 'authentication'],
        auth: 'firebase',
        plugins: {
          'hapi-swagger': {
            201: { description: 'Product added' },
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
  routeDeleteMembership(server) {
    server.route({
      method: 'DELETE',
      path: `/memberships/{userId}/{storeId}`,
      handler: this.handlers.deleteMembership.bind(this.handlers),
      config: {
        description: 'Remove a product from the cart.',
        tags: ['api', 'authentication'],
        auth: 'firebase',
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
   * PUT change the amount of product in the cart
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeUpdateSubscription(server) {
    server.route({
      method: 'PATCH',
      path: '/memberships/{id}',
      handler: this.handlers.updateSubscription.bind(this.handlers),
      config: {
        description: 'Change the amount of product in the cart.',
        tags: ['api', 'authentication'],
        auth: 'firebase',
        plugins: {
          'hapi-swagger': {
            200: { description: 'Amount updated' },
            400: { description: 'Bad request' }
          }
        }
      }
    });
  }

   /**
   * GET list the products in the cart
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeGetMembership(server) {
    server.route({
      method: 'GET',
      path: `/memberships/{userId}/{storeId}`,
      handler: this.handlers.getMembership.bind(this.handlers),
      config: {
        description: 'Get all products in a cart.',
        tags: ['api', 'authentication'],
        auth: 'firebase',
        plugins: {
          'hapi-swagger': {
            200: { description: 'Membership returned' },
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
    this.routeAddMembership(server);
    this.routeDeleteMembership(server);
    this.routeGetMembership(server);
    this.routeUpdateSubscription(server);
  }
}

module.exports = Router;
