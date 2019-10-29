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
  routeCreateUserSecurityGroup(server) {
    server.route({
      method: 'POST',
      path: `/user-security-groups/{id}`,
      handler: this.handlers.createUserSecurityGroup.bind(this.handlers),
      config: {
        description: `Create a user security group record.`,
        tags: ['api', 'cart'],
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
  routeRemoveUserSecurityGroupByUserId(server) {
    server.route({
      method: 'DELETE',
      path: `/user-security-groups/{userId}`,
      handler: this.handlers.removeUserSecurityGroupByUserId.bind(this.handlers),
      config: {
        description: 'Remove a user security group record by user id',
        tags: ['api', 'cart'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'User security group removed'},
            400: { description: 'Bad request (e.g. body empty)' }
          }
        }
      }
    })
  }
  
  /**
   * PUT remove product
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeRemoveUserSecurityGroup(server) {
    server.route({
      method: 'DELETE',
      path: `/user-security-groups/{userId}/{storeId}`,
      handler: this.handlers.removeUserSecurityGroup.bind(this.handlers),
      config: {
        description: 'Remove a user security group record by user id',
        tags: ['api', 'cart'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'User security group removed'},
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
  routeGetUserSecurityGroup(server) {
    server.route({
      method: 'GET',
      path: `/user-security-groups/{userId}/{storeId}`,
      handler: this.handlers.getUserSecurityGroup.bind(this.handlers),
      config: {
        description: 'Get a user security group given its userId and storeId.',
        tags: ['api', 'cart'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'User security group returned' },
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
    this.routeCreateUserSecurityGroup(server);
    this.routeRemoveUserSecurityGroupByUserId(server);
    this.routeRemoveUserSecurityGroup(server);
    this.routeGetUserSecurityGroup(server);
  }
}

module.exports = Router;
