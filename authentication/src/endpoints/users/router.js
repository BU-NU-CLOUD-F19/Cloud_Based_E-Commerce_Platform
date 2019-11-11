/**
 * The Router for the users, contains all HTTP routes pertaining to users actions and
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
   * POST add users
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeCreateUser(server) {
    server.route({
      method: 'POST',
      path: `/users`,
      handler: this.handlers.createUser.bind(this.handlers),
      config: {
        description: 'Add a  user.',
        tags: ['api', 'users'],
        plugins: {
          'hapi-swagger': {
            201: { description: 'User created' },
            400: { description: 'Bad request (e.g. body empty)' }
          }
        },
        validate: {
          payload: Joi.object().keys({
            fname: Joi.string().required()
                      .description('first name of the user'),
            lname: Joi.string().required()
                      .description('last name of the user'),
            email: Joi.string().required()
                      .description('email of the user'),
            phone: Joi.string().required()
                      .description('phone of the user'),
            address: Joi.string().required()
                      .description('address of the user'),
          }),
        }
      }
    });
  }

  /**
   * DELETE a user
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeDeleteUser(server) {
    server.route({
      method: 'DELETE',
      path: `/users/{id}`,
      handler: this.handlers.deleteUser.bind(this.handlers),
      config: {
        description: 'Remove a user.',
        tags: ['api', 'users'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'User removed'},
            400: { description: 'Bad request (e.g. body empty)' }
          }
        },
        validate: {
          params: Joi.object().keys({
            id: Joi.string().required()
                  .description('Id of the user to be deleted'),
          }),
        },
      }
    })
  }

  /**
   * PATCH a user
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routePatchUser(server) {
    server.route({
      method: 'PATCH',
      path: '/users/{id}',
      handler: this.handlers.updateUser.bind(this.handlers),
      config: {
        description: 'Update a user.',
        tags: ['api', 'users'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'User updated' },
            400: { description: 'Bad request' }
          }
        },
        validate: {
          params: Joi.object().keys({
            id: Joi.string().required()
                  .description('Id of the user to be updated'),
          }),
        },
      }
    });
  }

   /**
   * GET a user by its email
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeGetUserByEmail(server) {
    server.route({
      method: 'GET',
      path: `/users/byEmail/{email}`,
      handler: this.handlers.getUserByEmail.bind(this.handlers),
      config: {
        description: 'Get a user by email.',
        tags: ['api', 'users'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'user retrieved' },
            400: { description: 'Bad request' }
          }
        },
        validate: {
          params: Joi.object().keys({
            email: Joi.string().required()
                  .description('email of the user to be deleted'),
          }),
        },
      }
    });
  }
  
  /**
   * GET a user
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeGetUser(server) {
    server.route({
      method: 'GET',
      path: `/users/{id}`,
      handler: this.handlers.getUser.bind(this.handlers),
      config: {
        description: 'Get a user.',
        tags: ['api', 'users'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'user retrieved' },
            400: { description: 'Bad request' }
          }
        },
        validate: {
          params: Joi.object().keys({
            id: Joi.string().required()
                  .description('Id of the user to be retrieved'),
          }),
        },
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
