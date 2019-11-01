/**
 * The Router for the user-security-groups, contains all HTTP routes pertaining to user-security-groups actions and
 * links them to the corresponding handlers.
 */

'use strict';

// Handlers for the routes, triggered on request
const Handlers = require('./handlers');
const Joi = require('@hapi/joi');

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
   * POST create user security group record
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeCreateUserSecurityGroup(server) {
    server.route({
      method: 'POST',
      path: `/user-security-groups`,
      handler: this.handlers.createUserSecurityGroup.bind(this.handlers),
      config: {
        description: `Create a user security group record.`,
        tags: ['api', 'user-security-groups'],
        plugins: {
          'hapi-swagger': {
            201: { description: 'User Security Group created' },
            400: { description: 'Bad request (e.g. body empty)' }
          }
        },
        validate: {
          payload: Joi.object().keys({
            userId: Joi.string().required()
                      .description('id of the user'),
            storeId: Joi.string().required()
                      .description('id of the store'),
            securityGroupId: Joi.string().required()
                              .description('id of the security group'),
          }),
        }
      }
    });
  }

  /**
   * DELETE remove user security group by user
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeRemoveUserSecurityGroupByUserId(server) {
    server.route({
      method: 'DELETE',
      path: `/user-security-groups/{userId}`,
      handler: this.handlers.removeUserSecurityGroupByUserId.bind(this.handlers),
      config: {
        description: 'Remove a user security group record by user id',
        tags: ['api', 'user-security-groups'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'User security group removed'},
            400: { description: 'Bad request (e.g. body empty)' }
          }
        },
        validate: {
          params: Joi.object().keys({
            userId: Joi.string().required()
                      .description('id of the user')
          }),
        }
      }
    })
  }
  
  /**
   * DELETE remove user security groups
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeRemoveUserSecurityGroup(server) {
    server.route({
      method: 'DELETE',
      path: `/user-security-groups/{userId}/{storeId}`,
      handler: this.handlers.removeUserSecurityGroup.bind(this.handlers),
      config: {
        description: 'Remove a user security group record',
        tags: ['api', 'user-security-groups'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'User security group removed'},
            400: { description: 'Bad request (e.g. body empty)' }
          }
        },
        validate: {
          params: Joi.object().keys({
            userId: Joi.string().required()
                      .description('id of the user'),
            storeId: Joi.string().required()
                      .description('id of the store'),
          }),
        }
      }
    })
  }


   /**
   * GET user-security-group by user id and store id
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeGetUserSecurityGroup(server) {
    server.route({
      method: 'GET',
      path: `/user-security-groups/{userId}/{storeId}`,
      handler: this.handlers.getUserSecurityGroup.bind(this.handlers),
      config: {
        description: 'Get a user security group given its userId and storeId.',
        tags: ['api', 'user-security-groups'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'User security group returned' },
            400: { description: 'Bad request' }
          }
        },
        validate: {
          params: Joi.object().keys({
            userId: Joi.string().required()
                      .description('id of the user'),
            storeId: Joi.string().required()
                      .description('id of the store'),
          }),
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
