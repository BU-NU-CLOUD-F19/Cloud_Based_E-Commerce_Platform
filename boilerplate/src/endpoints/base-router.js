'use strict';

const elv = require('elv');
const Handlers = require('./base-handlers');

class Router {
  constructor(resource, handler, auth) {
    this.resource = resource;
    this.handler = elv.coalesce(handler, () => new Handlers());
  }

  routeGet(server) {
    server.route({
      method: 'GET',
      path: `/${this.resource}/{id}`,
      handler: this.handler.findOne.bind(this.handler),
      config: {
        description: `Get a ${this.resource} record.`,
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
