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
   * GET list the products in the cart
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeGetSecurityGroup(server) {
    server.route({
      method: 'GET',
      path: `/security-groups`,
      handler: this.handlers.getSecurityGroup.bind(this.handlers),
      config: {
        description: 'Get all products in a cart.',
        tags: ['api', 'authentication']
      }
    });
  }

   
  /**
   * Actually adds the routes to the server
   * @param {Hapi.server} server - the Hapi server
   */
  route(server) {
    this.routeGetSecurityGroup(server);
  }
}

module.exports = Router;
