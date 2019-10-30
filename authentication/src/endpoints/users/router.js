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
  routeCreateUser(server) {
    server.route({
      method: 'POST',
      path: `/users`,
      handler: this.handlers.createUser.bind(this.handlers),
      config: {
        description: `Add a product to the cart.`,
        tags: ['api', 'authentication'],
        plugins: {
          'hapi-swagger': {
            201: { description: 'User created' },
            400: { description: 'Bad request (e.g. body empty)' }
          }
        }
      }
    });
  }

  /**
   * DELETE remove user
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeDeleteUser(server) {
    server.route({
      method: 'DELETE',
      path: `/users/{id}`,
      handler: this.handlers.deleteUser.bind(this.handlers),
      config: {
        description: 'Remove a user.',
        tags: ['api', 'authentication'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'User removed'},
            400: { description: 'Bad request (e.g. body empty)' }
          }
        }
      }
    })
  }

  /**
   * PATCH update user
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routePatchUser(server) {
    server.route({
      method: 'PATCH',
      path: '/users/{id}',
      handler: this.handlers.updateUser.bind(this.handlers),
      config: {
        description: 'Update a user.',
        tags: ['api', 'authentication'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'User updated' },
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
  routeGetUserByEmail(server) {
    server.route({
      method: 'GET',
      path: `/users/{email}`,
      handler: this.handlers.getProducts.bind(this.handlers),
      config: {
        description: 'Get a user by email.',
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
   * GET list the products in the cart
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeGetUser(server) {
    server.route({
      method: 'GET',
      path: `/users/{id}`,
      handler: this.handlers.getUser.bind(this.handlers),
      config: {
        description: 'Get a user.',
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
    this.routeCreateUser(server);
    this.routeDeleteUser(server);
    this.routePatchUser(server);
    this.routeGetUser(server);
    this.routeGetUserByEmail(server);
  }
}

module.exports = Router;
