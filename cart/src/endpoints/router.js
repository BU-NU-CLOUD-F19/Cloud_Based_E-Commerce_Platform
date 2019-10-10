/**
 * The base class for all the router classes to be implemented.
 * This class defines the basic routes (GET, POST, PUT, PATCH, DELETE)
 * for all the resources.
 */

'use strict';

const Handlers = require('./handlers.js');
const resource = require('../constants/modelNames').cart;

class Router {
  constructor(handler) {
    this.resource = resource;
    this.handler = handler || (new Handlers());
  }

  routePost(server) {
    server.route([
      {
        method: 'POST',
        path: `/cart/{id}`,
        handler: this.handler.addProduct.bind(this.handler),
        config: {
          description: `Add a product to the cart.`,
          tags: ['api', 'cart'],
          plugins: {
            'hapi-swagger': {
              201: { description: 'Product added' },
              400: { description: 'Bad request (e.g. body empty)' }
            }
          }
        }
      }
    ]);
  }

  routePut(server) {
    server.route([
      {
        method: 'PUT',
        path: `/cart/{id}/remove`,
        handler: this.handler.removeProduct.bind(this.handler),
        config: {
          description: 'Remove a product from the cart.',
          tags: ['api', 'cart'],
          plugins: {
            'hapi-swagger': {
              200: { description: 'Product removed'},
              400: { description: 'Bad request (e.g. body empty)' }
            }
          }
        }
      },
      {
        method: 'PUT',
        path: '/cart/{id}/empty',
        handler: this.handler.emptyCart.bind(this.handler),
        config: {
          description: 'Empty the cart, removing all products (but does not remove the cart).',
          tags: ['api', 'cart'],
          plugins: {
            'hapi-swagger': {
              200: { description: 'Cart cleared' },
              400: { description: 'Bad request.' }
            }
          }
        }
      },
      {
        method: 'PUT',
        path: '/cart/{id}',
        handler: this.handler.changeAmount.bind(this.handler),
        config: {
          description: 'Change the amount of product in the cart.',
          tags: ['api', 'cart'],
          plugins: {
            'hapi-swagger': {
              200: { description: 'Amount updated' },
              400: { description: 'Bad request' }
            }
          }
        }
      }
    ]);
  }

  routeGet(server) {
    server.route([
      {
        method: 'GET',
        path: `/cart/{id}`,
        handler: this.handler.getProducts.bind(this.handler),
        config: {
          description: 'Get all products in a cart.',
          tags: ['api', 'cart'],
          plugins: {
            'hapi-swagger': {
              200: { description: 'Product listing returned' },
              400: { description: 'Bad request' }
            }
          }
        }
      }
    ]);
  }

  routeDelete(server) {
    server.route([
      {
        method: 'DELETE',
        path: '/cart/{id}',
        handler: this.handler.deleteCart.bind(this.handler),
        config: {
          description: 'Clear and delete the cart.',
          tags: ['api', 'cart'],
          plugins: {
            'hapi-swagger': {
              200: { description: 'Cart deleted' },
              400: { desription: 'Bad request' }
            }
          }
        }
      }
    ])
  }

  route(server) {
    this.routeGet(server);
    this.routePost(server);
    this.routePut(server);
    this.routeDelete(server);
  }

  // FOR REFERENCE */
  // routeGet(server) {
  //   server.route({
  //     method: 'GET',
  //     path: `/${this.resource}/{id}`,
  //     handler: this.handler.findOneById.bind(this.handler), // bind a request handler for this route
  //     config: {
  //       description: `Get a ${this.resource} record by id.`,
  //       tags: ['api'],
  //       plugins: {
  //         'hapi-swagger': {
  //           responses: {
  //             201: { description: 'Success' },
  //             400: { description: 'Bad Request' },
  //           },
  //         },
  //       },
  //     },
  //   });
  // }

  // routePost(server) {
  //   server.route({
  //     method: 'POST',
  //     path: `/${this.resource}`,
  //     handler: this.handler.insert.bind(this.handler),
  //     config: {
  //       description: `Post to ${this.resource}.`,
  //       tags: ['api'],
  //       plugins: {
  //         'hapi-swagger': {
  //           responses: {
  //             201: { description: 'Success' },
  //             400: { description: 'Bad Request' },
  //           },
  //         },
  //       },
  //     },
  //   });
  // }
}

module.exports = Router;
