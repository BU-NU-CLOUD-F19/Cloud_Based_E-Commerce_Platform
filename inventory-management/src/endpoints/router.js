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
                path: `/inventory`,
                handler: this.handler.addProduct.bind(this.handler),
                config: {
                    description: `Add a product to the inventory.`,
                    tags: ['api', 'inventory'],
                    plugins: {
                        'hapi-swagger': {
                            201: { description: 'Product added to the inventory' },
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
                path: `/inventory/remove/{id}`,
                handler: this.handler.removeProduct.bind(this.handler),
                config: {
                    description: 'Remove a product from the inventory.',
                    tags: ['api', 'inventory'],
                    plugins: {
                        'hapi-swagger': {
                            200: { description: 'Product removed from inventory' },
                            400: { description: 'Bad request (e.g. body empty)' }
                        }
                    }
                }
            },
            {
                method: 'PUT',
                path: '/inventory/empty',
                handler: this.handler.emptyCart.bind(this.handler),
                config: {
                    description: 'Empty the inventory.',
                    tags: ['api', 'inventory'],
                    plugins: {
                        'hapi-swagger': {
                            200: { description: 'Inventory emptied' },
                            400: { description: 'Bad request.' }
                        }
                    }
                }
            },
            {
                method: 'PUT',
                path: '/inventory/{id}',
                handler: this.handler.changeAmount.bind(this.handler),
                config: {
                    description: 'Change the details of product in the inventory.',
                    tags: ['api', 'cart'],
                    plugins: {
                        'hapi-swagger': {
                            200: { description: 'Product details updated' },
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
                path: `/inventory`,
                handler: this.handler.getProducts.bind(this.handler),
                config: {
                    description: 'Get all products in the inventory.',
                    tags: ['api', 'inventory'],
                    plugins: {
                        'hapi-swagger': {
                            200: { description: 'All Products in inventory returned' },
                            400: { description: 'Bad request' }
                        }
                    }
                }
            },
            {
                method: 'GET',
                path: `/inventory/{id}`,
                handler: this.handler.getProduct.bind(this.handler),
                config: {
                    description: 'Retrieve a product from the inventory.',
                    tags: ['api', 'inventory'],
                    plugins: {
                        'hapi-swagger': {
                            200: { description: 'Product with given ID returned.' },
                            400: { description: 'Bad request' }
                        }
                    }
                }
            }
        ]);
    }

    // routeDelete(server) {
    //     server.route([
    //         {
    //             method: 'DELETE',
    //             path: '/cart/{id}',
    //             handler: this.handler.deleteCart.bind(this.handler),
    //             config: {
    //                 description: 'Clear and delete the cart.',
    //                 tags: ['api', 'cart'],
    //                 plugins: {
    //                     'hapi-swagger': {
    //                         200: { description: 'Cart deleted' },
    //                         400: { desription: 'Bad request' }
    //                     }
    //                 }
    //             }
    //         }
    //     ])
    // }

    route(server) {
        this.routeGet(server);
        this.routePost(server);
        this.routePut(server);
    }
}

module.exports = Router;