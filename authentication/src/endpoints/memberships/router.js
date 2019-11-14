/**
 * The Router for the memberships, contains all HTTP routes pertaining to memberships actions and
 * links them to the corresponding handlers.
 */

'use strict';

// Handlers for the routes, triggered on request
const Handlers = require('./handlers');
const Joi = require('@hapi/joi');


// Authentication strategy

const auth = (process.env.NODE_ENV == 'test') ? null : 'firebase';
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
   * POST add memberships
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeAddMembership(server) {
    server.route({
      method: 'POST',
      path: `/memberships`,
      handler: this.handlers.addMembership.bind(this.handlers),
      config: {
        description: `Add a memberships.`,
        tags: ['api', 'memberships'],
        auth,
        plugins: {
          'hapi-swagger': {
            201: { description: 'Memberships added' },
            400: { description: 'Bad request (e.g. body empty)' }
          }
        },
        validate: {
          payload: Joi.object().keys({
              userId: Joi.string()
                      .required()
                      .description('The user id whose membership is to be created'),
              storeId: Joi.string()
                        .required()
                        .description('The store id for which the membership is to be created'),
              subscriptionStatus: Joi.boolean().description('Email subscription'),
          }),
        }
      },
    });
  }

  /**
   * DELETE remove a membership
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeDeleteMembership(server) {
    server.route({
      method: 'DELETE',
      path: `/memberships/{userId}/{storeId}`,
      handler: this.handlers.deleteMembership.bind(this.handlers),
      config: {
        description: 'Remove a membership.',
        tags: ['api', 'memberships'],
        auth,
        plugins: {
          'hapi-swagger': {
            200: { description: 'Membership removed'},
            400: { description: 'Bad request (e.g. body empty)' }
          }
        },
        validate: {
          params: Joi.object().keys({
              userId : Joi.string()
                      .required()
                      .description('The user id whose membership is to be created'),
              storeId : Joi.string()
                        .required()
                        .description('The store id for which the membership is to be created'),
          }),
        }
      },
    });
  }

  /**
   * PATCH update the subscription status of a membership
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeUpdateSubscription(server) {
    server.route({
      method: 'PATCH',
      path: '/memberships/{id}',
      handler: this.handlers.updateSubscription.bind(this.handlers),
      config: {
        description: 'Change the subscription of membership.',
        tags: ['api', 'memberships'],
        auth,
        plugins: {
          'hapi-swagger': {
            200: { description: 'Subscription updated' },
            400: { description: 'Bad request' }
          }
        },
        validate: {
          params: Joi.object().keys({
              id : Joi.string()
                      .required()
                      .description('The id whose membership is to be created'),
          }),
          payload: Joi.object().keys({
            subscriptionStatus : Joi.boolean().required()
                                  .description('The new subscription status to be updated the membership to.')
          }),
        }
      },
    });
  }

   /**
   * GET a user membership by its store
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeGetMembership(server) {
    server.route({
      method: 'GET',
      path: `/memberships/{userId}/{storeId}`,
      handler: this.handlers.getMembership.bind(this.handlers),
      config: {
        description: 'Get a membership.',
        tags: ['api', 'memberships'],
        auth,
        plugins: {
          'hapi-swagger': {
            200: { description: 'Membership returned' },
            400: { description: 'Bad request' }
          }
        },
        validate: {
          params: Joi.object().keys({
              userId : Joi.string()
                      .required()
                      .description('The user id whose membership is to be retrieved'),
              storeId : Joi.string()
                        .required()
                        .description('The store id for which the membership is to be retrieved'),
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
    this.routeAddMembership(server);
    this.routeDeleteMembership(server);
    this.routeGetMembership(server);
    this.routeUpdateSubscription(server);
  }
}

module.exports = Router;
