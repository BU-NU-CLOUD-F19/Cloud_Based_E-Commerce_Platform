/**
 * The base class for all the router classes to be implemented.
 * This class defines the basic routes (GET, POST, PUT, PATCH, DELETE)
 * for all the resources.
 */

'use strict';

const elv = require('elv');
const Handlers = require('./base-handler');

class Router {
  constructor(resource, handler, auth) {
    this.resource = resource;
    this.handler = elv.coalesce(handler, () => new Handlers());
  }

  routeGet(server) {
    server.route({
      method: 'GET',
      path: `/${this.resource}/{id}`,
      handler: this.handler.findOneById.bind(this.handler), // bind a request handler for this route
      config: {
        description: `Get a ${this.resource} record by id.`,
        tags: ['api'],
        plugins: {
          'hapi-swagger': {
            responses: {
              201: { description: 'Success' },
              400: { description: 'Bad Request' },
            },
          },
        },
      },
    });
  }

  routePost(server) {
    server.route({
      method: 'POST',
      path: `/${this.resource}`,
      handler: this.handler.insert.bind(this.handler),
      config: {
        description: `Post to ${this.resource}.`,
        tags: ['api'],
        plugins: {
          'hapi-swagger': {
            responses: {
              201: { description: 'Success' },
              400: { description: 'Bad Request' },
            },
          },
        },
      },
    });
  }

  route(server) {
    this.routeGet(server);
    this.routePost(server);
  }
}

module.exports = Router;
