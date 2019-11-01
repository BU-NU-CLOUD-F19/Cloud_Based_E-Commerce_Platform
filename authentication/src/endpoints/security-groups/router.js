/**
 * The Router for the security-groups, contains all HTTP routes pertaining to security-groups actions and
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
   * GET all the security-groups
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeGetSecurityGroups(server) {
    server.route({
      method: 'GET',
      path: `/security-groups`,
      handler: this.handlers.getSecurityGroups.bind(this.handlers),
      config: {
        description: 'Get all products in a security-groups.',
        tags: ['api', 'security-groups']
      }
    });
  }

   
  /**
   * Actually adds the routes to the server
   * @param {Hapi.server} server - the Hapi server
   */
  route(server) {
    this.routeGetSecurityGroups(server);
  }
}

module.exports = Router;
