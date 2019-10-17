/**
 * This file should be extended by all the request handlers implemented.
 * It is the base class that contains the request handling logic for
 * GET POST, PUT, PATCH, DELETE requests for the resources
 */

'use strict';

const logger = require('../utils/logger');
const Model = require('../models').Model;

/**
 * The handler functions for all endpoints defined for the inventory management service
 */
class Handlers {
    constructor(model) {
        this.model = model || (new Model());
        this.logger = logger;
    }

    /**
    * Check if properties are present in an object, returns an object with a boolean value.
    * When a property is missing, it also returns the missing property.
    * @static
    * @param {array} proplist - an array of properties that you want to check
    * @param {object} obj - the object to check
    */
    static propsPresent(proplist, obj) {
        for (let prop of proplist) {
            if (!(prop in obj)) {
                return { valid: false, missing: prop };
            }
        }
        return { valid: true };
    }

    /**
    * Add a product to the inventory
    * @async
    * @param {Hapi.request} req - the request object
    * @param {object} rep - the response toolkit (Hapi.h)
    */
    async addProduct(req, rep) {
        // Some initial error checking
        if (!req.payload) {
            return rep.response("Body cannot be empty.").code(400);
        }

        this.logger.debug(`Handler: Adding product ${JSON.stringify(req.payload)} to inventory`);

        try {
            // Add the product to the inventory
            const res = await this.model.addProduct(req.payload);
            this.logger.debug(`\tResult: ${JSON.stringify(res)}`);
            return rep.response({ data: res }).code(201);
        }

        // Catch any database errors (e.g. product not found)
        catch (err) {
            this.logger.error(JSON.stringify(err));
            throw err;
        }
    }

    /**
    * Updates a product with provided id in the inventory
    * @async
    * @param {Hapi.request} req - the request object
    * @param {object} rep - the response toolkit (Hapi.h)
    */
    async updateProduct(req, rep) {
        // Some initial error checking
        if (!req.payload) {
            return rep.response("Body cannot be empty.").code(400);
        }

        this.logger.debug(`Handler: Updating product ${JSON.stringify(req.payload)} in inventory`);

        try {
            // Update the product in the inventory
            const res = await this.model.updateProduct(req.params.id, req.payload);
            if (res.length > 0) {
                return rep.response({ message: "Product updated.", data: res });
            }
            // If nothing was updated, the product wasn't in the inventory.
            else {
                return rep.response({ message: "No such product in inventory." }).code(400);
            }
        }

        // Catch any database errors (e.g. product not found)
        catch (err) {
            this.logger.error(JSON.stringify(err));
            throw err;
        }
    }

    /**
    * Removes a product from the inventory
    * @async
    * @param {Hapi.request} req - the request object
    * @param {object} rep - the response toolkit (Hapi.h)
    */
    async removeProduct(req, rep) {
        const isValid = Handlers.propsPresent(['id'], req.params);
        if (!isValid.valid) {
            return rep.response(`${isValid.missing} not specified.`).code(400);
        }

        this.logger.debug(`Handler: Removing product from inventory ${req.params.id}`);

        try {
            const res = await this.model.removeProduct(req.params.id);
            this.logger.debug(`\tResult: ${JSON.stringify(res)}`);

            // If no rows were removed
            if (res === 0) {
                return rep.response(`Product ${req.payload.pid} not in inventory ${req.params.id}.`);
            }
            else {
                return rep.response({ data: res }).code(200);
            }
        }
        catch (err) {
            this.logger.error(JSON.stringify(err));
            throw err;
        }
    }

    /**
    * List the products in the inventory
    * @async
    * @param {Hapi.request} req - the request object
    * @param {object} rep - the response toolkit (Hapi.h)
    */
    async getProducts(req, rep) {
        try {
            this.logger.debug(`Handler: Listing all products in the inventory`);
            const result = await this.model.getProducts();
            return rep.response({ data: result }).code(200);
        }
        catch (err) {
            this.logger.error(err.message);
        }
    }

    /**
    * Retrieve a product with a given ID in the inventory
    * @async
    * @param {Hapi.request} req - the request object
    * @param {object} rep - the response toolkit (Hapi.h)
    */
    async getProduct(req, rep) {
        const isValid = Handlers.propsPresent(['id'], req.params);
        if (!isValid.valid) {
            return rep.response(`${isValid.missing} not specified.`).code(400);
        }
        this.logger.debug(`Handler: Retrieving product with ID ${req.params.id} from inventory`);

        try {
            const res = await this.model.getProduct(req.params.id);
            this.logger.debug(`\tResult: ${JSON.stringify(res)}`);

            // If no rows were removed
            if (res === 0) {
                return rep.response(`Product not in inventory ${req.params.id}.`);
            }
            else {
                return rep.response({ data: res }).code(200);
            }
        }
        catch (err) {
            this.logger.error(JSON.stringify(err));
            throw err;
        }
    }
}

module.exports = Handlers;