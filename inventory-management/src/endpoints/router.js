/**
 * The base class for all the router classes to be implemented.
 * This class defines the basic routes (GET, POST, PUT, PATCH, DELETE)
 * for all the resources.
 */

'use strict';

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
        this.handler = new Handlers();
    }

    /**
    * All HTTP POST route definitions
    * @param {Hapi.server} server - the Hapi server to which to add the route
    */
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

    /**
    * All HTTP PUT route definitions
    * @param {Hapi.server} server - the Hapi server to which to add the route
    */
    routePut(server) {
        server.route([
            {
                method: 'PUT',
                path: '/inventory/{id}',
                handler: this.handler.updateProduct.bind(this.handler),
                config: {
                    description: 'Change the details of product in the inventory.',
                    tags: ['api', 'inventory'],
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

    /**
    * All HTTP GET route definitions
    * @param {Hapi.server} server - the Hapi server to which to add the route
    */
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

    /**
    * All HTTP DELETE route definitions
    * @param {Hapi.server} server - the Hapi server to which to add the route
    */
    routeDelete(server) {
        server.route([
            {
                method: 'DELETE',
                path: `/inventory/{id}`,
                handler: this.handler.removeProduct.bind(this.handler),
                config: {
                    description: `Remove the product from the inventory.`,
                    tags: ['api', 'inventory'],
                    plugins: {
                        'hapi-swagger': {
                            201: { description: 'Product removed from the inventory' },
                            400: { description: 'Bad request' }
                        }
                    }
                }
            }
        ]);
    }

    /**
    * Actually adds the routes to the server
    * @param {Hapi.server} server - the Hapi server
    */
    route(server) {
        this.routeGet(server);
        this.routePost(server);
        this.routePut(server);
        this.routeDelete(server);
    }
}

module.exports = Router;