/**
 * The Router for the auth-token
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
   * POST generate token
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeGenerateToken(server) {
    server.route({
      method: 'POST',
      path: `/authorization/token`,
      handler: this.handlers.generateToken.bind(this.handlers),
      config: {
        description: `Generate a token.`,
        tags: ['auth-token']
      }
    });
  }


  /**
   * Actually adds the routes to the server
   * @param {Hapi.server} server - the Hapi server
   */
  route(server) {
    this.routeGenerateToken(server);
  }
}

module.exports = Router;
