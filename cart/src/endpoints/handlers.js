/**
 * These are the handlers for the endpoints for the cart.
 * It's the code that actually contains the logic for each endpoint.
 */

'use strict';

const logger = require('../utils/logger');
const Model = require('../models').Model;

/**
 * The handler functions for all endpoints defined for the cart
 */
class Handlers {
  constructor() {
    this.model = new Model();
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
        return {valid: false, missing: prop};
      }
    }
    return {valid: true};
  }

  /**
   * Log a request using Winston
   * @param {Hapi.request} req - the request object
   */
  logRequest(req) {
    this.logger.info(`HTTP ${req.method} ${req.path}`)
  }

  /**
   * Add a product to a cart.
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async addProduct(req, rep) {
    this.logRequest(req);

    // Check if request contains a body
    if (!req.payload) {
      return rep.response({message: "Body cannot be empty."}).code(400);
    }

    // Check if request body contains the required values
    const isValid = Handlers.propsPresent(['pid', 'amount_in_cart'], req.payload);
    if (!isValid.valid) {
      return rep.response({message: `${isValid.missing} not specified.`}).code(400);
    }

    this.logger.debug(`\tHandler: Adding product ${JSON.stringify(req.payload)} to cart ${req.params.id}`);

    try {
      // Add the product to the cart
      const res = await this.model.addProduct(req.params.id, req.payload);
      this.logger.debug(`\tResult: ${JSON.stringify(res)}`);

      // Return what was added
      return rep.response({message: "Product added to cart.", data: res}).code(201);
    }

    // Catch any database errors (e.g. product not found) and return the appropriate response
    catch (err) {
      if (err.constraint === "products_in_cart_pid_fkey") {
        let message = 'Product does not exist.';
        this.logger.debug(`\t${message}`);
        return rep.response({message: message}).code(400);
      }
      else if (err.constraint === "carts_uid_fkey") {
        let message = '\tUser does not exist.';
        this.logger.debug(`${message} -- ${err.detail}`);
        return rep.response({message: message}).code(400);
      }
      else if (err.constraint === "products_in_cart_pkey") {
        let message = '\tProduct already present in cart.';
        this.logger.debug(`${message} -- ${err.detail}`);
        return rep.response({message: message}).code(400);
      }
      else {
        this.logger.error(JSON.stringify(err));
        throw err;
      }
    }
  }

  /**
   * Remove a product from a cart
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async removeProduct(req, rep) {
    this.logRequest(req);

    // Check if request contains a body
    if (!req.payload) {
      return rep.response({message: "Body cannot be empty."}).code(400);
    }

    // Check if request body contains the required values
    const isValid = Handlers.propsPresent(['pid'], req.payload);
    if (!isValid.valid) {
      return rep.response({message: `${isValid.missing} not specified.`}).code(400);
    }

    this.logger.debug(`\tHandler: Removing product ${req.payload} from cart ${req.params.id}`);

    try {
      // Remove the product from the cart
      const res = await this.model.removeProduct(req.params.id, req.payload);
      this.logger.debug(`\tResult: ${JSON.stringify(res)}`);

      // If no rows were removed (i.e. the products wasn't in cart), respond with a 400.
      if (res === 0) {
        return rep.response({message: `Product ${req.payload.pid} not in cart ${req.params.id}.`}).code(400);
      }
      else {
        // Otherwise, return  how many rows were removed
        return rep.response({message: "Product removed from cart.", data: res}).code(200);
      }
    }
    catch (err) {
      this.logger.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Change the amount of a product in a cart.
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async changeAmount(req, rep) {
    this.logRequest(req);

    // TODO: Should we deal with product not in stock?

    // Check if request contains a body
    if (!req.payload) {
      return rep.response({message: "Body cannot be empty."}).code(400);
    }

    // Check if request body contains the required values
    const isValid = Handlers.propsPresent(['pid', 'amount_in_cart'], req.payload);
    if (!isValid.valid) {
      return rep.response({message: `${isValid.missing} not specified.`}).code(400);
    }

    // Check if the new amount is valid
    if (req.payload.amount_in_cart <= 0) {
      return rep.response({message: "Amount must be greater than 0."}).code(400);
    }

    this.logger.debug(`\tHandler: Changing amount of product in cart ${req.params.id}`);

    try {
      // Change the amount in the cart
      const res = await this.model.changeAmount(req.params.id, req.payload);

      // Return the new product record
      if (res.length > 0) {
        return rep.response({message: "Amount updated.", data: res});
      }
      // If nothing was updated, the product wasn't in the cart.
      else {
        return rep.response({message: "No such product in cart."}).code(400);
      }
    }
    // Catch database errors
    catch(err) {
      if (err.constraint === "products_in_cart_pid_fkey") {
        let message = 'Product does not exist.';
        this.logger.debug(`\t${message}`);
        return rep.response({message: message}).code(400);
      }
      else {
        this.logger.error(JSON.stringify(err));
      }
    }

  }

  /**
   * Empty the cart (remove all products)
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async emptyCart(req, rep) {
    this.logRequest(req);

    // If cart does not exist, error
    this.logger.debug(`\tHandler: Emptying cart ${req.params.id}`);

    try {
      // Empty the cart
      const res = await this.model.emptyCart(req.params.id);

      // Return the number of products removed
      return rep.response({message: "Cart emptied.", data: res}).code(200);
    }
    catch(err) {
      this.logger.error(JSON.stringify(err));
    }
  }

  /**
   * Remove the cart including all products
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async deleteCart(req, rep) {
    this.logRequest(req);

    this.logger.debug(`\tHandler: Removing cart ${req.params.id}`);

    try {
      // Delete the cart
      const res = await this.model.deleteCart(req.params.id);

      // If something has been deleted, return the number of carts deleted (should always be 1)
      if (res === 1) {
        return rep.response({message: "Cart deleted.", data: res})
      }
      // If nothing was deleted, cart doesn't exist
      else if (res === 0) {
        return rep.response({message: "Cart does not exist"}).code(400);
      }
      // You should never delete more than one cart
      else {
        this.logger.error(`Deleted more than one cart, this shouldn't happen: ${res}`);
      }
    }
    catch(err) {
      this.logger.error(JSON.stringify(err));
    }
  }

  /**
   * List the products in a cart
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async getProducts(req, rep) {
    this.logRequest(req);

    try {
      this.logger.debug(`\tHandler: Listing all products in ${req.params.id}`);

      // Get the products in the cart and return them
      const result = await this.model.getProducts(req.params.id);
      return rep.response({message: "Products retrieved.", data: result}).code(200);
    }
    catch(err)  {
      this.logger.error(err.message);
    }
  }
}

module.exports = Handlers;
