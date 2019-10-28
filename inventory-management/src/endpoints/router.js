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
    * POST add product
    * @param {Hapi.server} server - the Hapi server to which to add the route
    */
    routeAddProduct(server) {
        server.route(
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
        );
    }

    /**
    * PUT update product
    * @param {Hapi.server} server - the Hapi server to which to add the route
    */
    routeUpdateProduct(server) {
        server.route(
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
        );
    }

    /**
    * GET list of products
    * @param {Hapi.server} server - the Hapi server to which to add the route
    */
    routeGetProducts(server) {
        server.route(
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
            });
    }
    /**
    * GET product given ID
    * @param {Hapi.server} server - the Hapi server to which to add the route
    */
    routeGetProduct(server) {
        server.route(
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
        );
    }

    /**
    * DELETE product given ID
    * @param {Hapi.server} server - the Hapi server to which to add the route
    */
    routeRemoveProduct(server) {
        server.route(
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
        );
    }

    /**
    * Actually adds the routes to the server
    * @param {Hapi.server} server - the Hapi server
    */
    route(server) {
        this.routeAddProduct(server);
        this.routeUpdateProduct(server);
        this.routeGetProducts(server);
        this.routeGetProduct(server);
        this.routeRemoveProduct(server);
    }
}

module.exports = Router;