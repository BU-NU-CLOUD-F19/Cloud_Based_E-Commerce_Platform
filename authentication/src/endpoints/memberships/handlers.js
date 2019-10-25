/**
 * These are the handlers for the endpoints for the memberships.
 * It's the code that actually contains the logic for each endpoint.
 */

'use strict';

const logger = require('../utils/logger');
const Memberships = require('../models/').Memberships;

/**
 * The handler functions for all endpoints defined for the memberships
 */
class Handlers {
  constructor() {
    this.memberships = new Memberships();
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
   * Add a membership
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async addMembership(req, rep) {
    this.logger.logRequest(req);
    const { payload } = req;

    // Check if request contains a body
    if (!payload) {
      return rep.response({message: "Body cannot be empty."}).code(400);
    }

    // Check if request body contains the required values
    const isValid = Handlers.propsPresent(['userId', 'storeId'], payload);
    if (!isValid.valid) {
      return rep.response({message: `${isValid.missing} not specified.`}).code(400);
    }

    this.logger.debug(`\tHandler: Adding membership ${JSON.stringify(payload)}`);

    try {
      const res = await this.memberships.addMembership(id, payload);
      this.logger.debug(`\tResult: ${JSON.stringify(res)}`);

      // Return what was added
      return rep.response({message: "Memberhip created for user"}).code(201);
    }

    // Catch any database errors (e.g. product not found) and return the appropriate response
    catch (err) {
      if (err.constraint === "stores_id_fkey") {
        let message = 'Store does not exist.';
        this.logger.debug(`\t${message} -- ${err.detail}`);
        return rep.response({message: message}).code(400);
      }
      else if (err.constraint === "users_uid_fkey") {
        let message = 'User does not exist.';
        this.logger.debug(`\t${message} -- ${err.detail}`);
        return rep.response({message: message}).code(400);
      }
      else {
        this.logger.error(JSON.stringify(err));
        throw err;
      }
    }
  }

  /**
   * Remove a membership
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async removeMembership(req, rep) {
    this.logger.logRequest(req);
    const { payload } = req;

    // Check if request contains a body
    if (!payload) {
      return rep.response({message: "Body cannot be empty."}).code(400);
    }

    // Check if request body contains the required values
    const isValid = Handlers.propsPresent(['storeId', 'userId'], payload);
    if (!isValid.valid) {
      return rep.response({message: `${isValid.missing} not specified.`}).code(400);
    }

    this.logger.debug(`\tHandler: Removing membership of user ${userId} from store ${storeId}`);

    try {
      const res = await this.memberships.removeMembership(storeId, userId);
      this.logger.debug(`\tResult: ${JSON.stringify(res)}`);

      if (res === 0) {
        return rep.response({message: `Membership not present`}).code(400);
      }
      else {
        // Otherwise, return  how many rows were removed
        return rep.response({message: "Memberships removed: ", data: res}).code(200);
      }
    }
    catch (err) {
      this.logger.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Update subscription status
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async updateSubscription(req, rep) {
    this.logger.logRequest(req);
    const { params: { id }, payload } = req;

    // Check if request contains a body
    if (!payload) {
      return rep.response({message: "Body cannot be empty."}).code(400);
    }

    // Check if request body contains the required values
    const isValid = Handlers.propsPresent(['userId', 'storeId', 'subscriptionStatus'], payload);
    if (!isValid.valid) {
      return rep.response({message: `${isValid.missing} not specified.`}).code(400);
    }

    this.logger.debug(`\tHandler: Updating sbscription status for
     user ${userId} in store ${storeId} to ${subscriptionStatus}`);

    try {
      // Update subscription status
      const res = await this.memberships.updateMembershipsSubscription(storeId, userId, subscribed);

      // Return the new product record
      if (res.length > 0) {
        return rep.response({message: "Subscription updated.", data: res});
      }
      else {
        return rep.response({message: "No such membership present."}).code(400);
      }
    }
    // Catch database errors
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
    const { params: { id }} = req;
    this.logger.logRequest(req);

    this.logger.debug(`\tHandler: Removing cart ${id}`);

    try {
      // Empty the cart
      await this.productsInCart.emptyCart(id);

      // Delete the cart
      const res = await this.carts.deleteCart(id);

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
    const { params: { id }} = req;
    this.logger.logRequest(req);

    try {
      this.logger.debug(`\tHandler: Listing all products in ${id}`);

      // Get the products in the cart and return them
      const result = await this.productsInCart.getProducts(id);
      return rep.response({message: "Products retrieved.", data: result}).code(200);
    }
    catch(err)  {
      this.logger.error(err.message);
    }
  }
}

module.exports = Handlers;
