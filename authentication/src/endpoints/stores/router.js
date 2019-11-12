/**
 * The Router for the stores, contains all HTTP routes pertaining to stores actions and
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
   * POST add store
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeAddStore(server) {
    server.route({
      method: 'POST',
      path: `/stores`,
      handler: this.handlers.addStore.bind(this.handlers),
      config: {
        description: `Add a product to the stores.`,
        tags: ['api', 'stores'],
        plugins: {
          'hapi-swagger': {
            201: { description: 'Store added' },
            400: { description: 'Bad request (e.g. body empty)' }
          }
        },
        validate: {
          payload: Joi.object().keys({
            name: Joi.string().required()
                  .description('Name of the store'),
            phone: Joi.string().required()
                  .description('Phone of the store'),
            email: Joi.string().required()
                  .description('Email of the store'),
            address: Joi.string().description('Physical address of the store'),
          })
        }
      }
    });
  }

  /**
   * DELETE remove product
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeRemoveStore(server) {
    server.route({
      method: 'DELETE',
      path: `/stores/{id}`,
      handler: this.handlers.deleteStore.bind(this.handlers),
      config: {
        description: 'Remove a store.',
        tags: ['api', 'stores'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'Store removed'},
            400: { description: 'Bad request (e.g. body empty)' }
          }
        },
        validate: {
          params: Joi.object().keys({
            id: Joi.string().required()
                  .description('Id of the store to be deleted')
          })
        }
      }
    });
  }

   /**
   * GET a store
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routeGetStore(server) {
    server.route({
      method: 'GET',
      path: `/stores/{id}`,
      handler: this.handlers.getStoreById.bind(this.handlers),
      config: {
        description: 'Get a store.',
        tags: ['api', 'stores'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'Store retrieved' },
            400: { description: 'Bad request' }
          }
        },
        validate: {
          params: Joi.object().keys({
            id: Joi.string().required()
                  .description('Id of the store to be retrieved')
          })
        }
      }
    });
  }

  /**
   * PATCH update store
   * @param {Hapi.server} server - the Hapi server to which to add the route
   */
  routePatchStore(server) {
    server.route({
      method: 'PATCH',
      path: '/stores/{id}',
      handler: this.handlers.updateStore.bind(this.handlers),
      config: {
        description: 'Update a store.',
        tags: ['api', 'stores'],
        plugins: {
          'hapi-swagger': {
            200: { description: 'Store updated' },
            400: { description: 'Bad request' }
          }
        },
        validate: {
          params: Joi.object().keys({
            id: Joi.string().required()
                  .description('Id of the store to be updated')
          })
        }
      }
    });
  }

  /**
   * Actually adds the routes to the server
   * @param {Hapi.server} server - the Hapi server
   */
  route(server) {
    this.routeAddStore(server);
    this.routeRemoveStore(server);
    this.routeGetStore(server);
    this.routePatchStore(server);
  }
}

module.exports = Router;
