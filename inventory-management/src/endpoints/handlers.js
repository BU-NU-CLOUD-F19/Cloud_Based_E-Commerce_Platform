/**
 * This file should be extended by all the request handlers implemented.
 * It is the base class that contains the request handling logic for
 * GET POST, PUT, PATCH, DELETE requests for the resources
 */

'use strict';

const logger = require('../utils/logger');
const Model = require('../models').Model;

class Handlers {
    constructor(model) {
        this.model = model || (new Model());
        this.logger = logger;
    }

    static propsPresent(proplist, obj) {
        for (let prop of proplist) {
            if (!(prop in obj)) {
                return { valid: false, missing: prop };
            }
        }
        return { valid: true };
    }
    async addProduct(req, rep) {
        // Some initial error checking
        if (!req.payload) {
            return rep.response("Body cannot be empty.").code(400);
        }
        const isValid = this.propsPresent(['pid', 'amount_in_cart'], req.payload);
        if (!isValid.valid) {
            return rep.response(`${isValid.missing} not specified.`).code(400);
        }

        this.logger.debug(`Handler: Adding product ${JSON.stringify(req.payload)} to cart ${req.params.id}`);

        try {
            // Add the product to the cart
            const res = await this.model.addProduct(req.params.id, req.payload);
            this.logger.debug(`\tResult: ${JSON.stringify(res)}`);
            return rep.response({ data: res }).code(201);
        }

        // Catch any database errors (e.g. product not found)
        catch (err) {
            if (err.constraint === "products_in_cart_pid_fkey") {
                let message = 'Product does not exist.';
                this.logger.debug(`\t${message}`);
                return rep.response(message).code(400);
            }
            else if (err.constraint === "carts_uid_fkey") {
                let message = '\tUser does not exist.';
                this.logger.debug(`${message} -- ${err.detail}`);
                return rep.response(message).code(400);
            }
            else if (err.constraint === "products_in_cart_pkey") {
                let message = '\tProduct already present in cart.';
                this.logger.debug(`${message} -- ${err.detail}`);
                return rep.response(message).code(400);
            }
            else {
                this.logger.error(JSON.stringify(err));
                throw err;
            }
        }
    }

    async removeProduct(req, rep) {
        if (!req.payload) {
            return rep.response("Body cannot be empty.").code(400);
        }
        const isValid = this.propsPresent(['pid'], req.payload);
        if (!isValid.valid) {
            return rep.response(`${isValid.missing} not specified.`).code(400);
        }


        this.logger.debug(`Handler: Removing product ${req.payload} from cart ${req.params.id}`);

        try {
            const res = await this.model.removeProduct(req.params.id, req.payload);
            this.logger.debug(`\tResult: ${JSON.stringify(res)}`);

            // If no rows were removed
            if (res === 0) {
                return rep.response(`Product ${req.payload.pid} not in cart ${req.params.id}.`);
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

    async changeAmount(req, rep) {
        // TODO: Should we deal with product not in stock?

        if (!req.payload) {
            return rep.response("Body cannot be empty.").code(400);
        }
        const isValid = this.propsPresent(['pid', 'amount_in_cart'], req.payload);
        if (!isValid.valid) {
            return rep.response(`${isValid.missing} not specified.`).code(400);
        }
        if (req.payload.amount_in_cart <= 0) {
            return rep.response("Amount must be greater than 0.").code(400);
        }

        this.logger.debug(`Handler: Changing amount of product in cart ${req.params.id}`);

        try {
            const res = await this.model.changeAmount(req.params.id, req.payload);

            if (res.length > 0) {
                return rep.response({ message: "Amount updated.", data: res });
            }
            else {
                return rep.response("No such product in cart.").code(400);
            }
        }
        catch (err) {
            if (err.constraint === "products_in_cart_pid_fkey") {
                let message = 'Product does not exist.';
                this.logger.debug(`\t${message}`);
                return rep.response(message).code(400);
            }
            else {
                this.logger.error(JSON.stringify(err));
            }
        }

    }

    async emptyCart(req, rep) {
        // If cart does not exist, error
        this.logger.debug(`Handler: Emptying cart ${req.params.id}`);

        try {
            const res = await this.model.emptyCart(req.params.id);
            return rep.response({ message: "Cart emptied.", data: res }).code(200);
        }
        catch (err) {
            this.logger.error(JSON.stringify(err));
        }

    }

    async deleteCart(req, rep) {
        // If cart does not exist, error
        // Empty the cart.
        // Delete the cart.
        this.logger.debug(`Handler: Removing cart ${req.params.id}`);

        try {
            const res = await this.model.deleteCart(req.params.id);

            if (res > 0) {
                return rep.response({ message: "Cart deleted.", data: res })
            }
            else {
                return rep.response("Cart does not exist").code(400);
            }
        }
        catch (err) {
            this.logger.error(JSON.stringify(err));
        }
    }

    async getProducts(req, rep) {
        try {
            this.logger.debug(`Handler: Listing all products in ${req.params.id}`);
            const result = await this.model.getProducts(req.params.id);
            return rep.response({ data: result }).code(200);
        }
        catch (err) {
            this.logger.error(err.message);
        }
    }

    /**
     * Find an object by its id
     * @param  {Object} req - the request object
     * @param  {Object} rep - the response object
     */
    // findOneById(req, rep) {
    //   const id = req.params.id;
    //   const reply = rep;

    //   return this.model.findOneById(id)
    //     .then((result) => {
    //       logger.info(`Get request for ${this.model.resource}`);
    //       return reply.response(result).code(200);
    //     })
    //     .catch((err) => {
    //       logger.error(err.message);
    //     });
    // }

    // insert(req, rep) {
    //   const data = req.payload;
    //   const reply = rep;

    //   return this.model.insert(data)
    //     .then(result => reply.response(result).code(201))
    //     .catch(err => logger.error(err.message));
    // }
}

module.exports = Handlers;