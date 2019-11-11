/**
 * These are the handlers for the endpoints for the memberships.
 * It's the code that actually contains the logic for each endpoint.
 */

'use strict';

const logger = require('../../utils/logger');
const { Memberships } = require('../../models/');

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
    const { userId, storeId, subscriptionStatus = true } = payload;
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
      const res = await this.memberships.createMembership(userId, storeId, subscriptionStatus);

      this.logger.debug(`\tResult: ${JSON.stringify(res)}`);

      // Return what was added
      return rep.response({message: "Membership created for user", data: res}).code(201);
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
   * Delete a membership
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async deleteMembership(req, rep) {
    this.logger.logRequest(req);
    const { params: { userId, storeId } } = req;

    this.logger.debug(`\tHandler: Removing membership of user ${userId} from store ${storeId}`);

    try {
      const res = await this.memberships.deleteMembership(storeId, userId);
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
   * Update subscription status for a user's membership
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async updateSubscription(req, rep) {
    this.logger.logRequest(req);
    const { params: { userId, storeId }, payload } = req;

    // Check if request contains a body
    if (!payload) {
      return rep.response({message: "Body cannot be empty."}).code(400);
    }

    // Check if request body contains the required values
    const isValid = Handlers.propsPresent(['subscriptionStatus'], payload);
    if (!isValid.valid) {
      return rep.response({message: `${isValid.missing} not specified.`}).code(400);
    }

    const { subscriptionStatus } = payload;
    this.logger.debug(`\tHandler: Updating sbscription status for
     user ${userId} in store ${storeId} to ${subscriptionStatus}`);

    try {
      // Update subscription status
      const res = await this.memberships.updateMembershipSubscription(storeId, userId, subscriptionStatus);

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
   * Get a membership
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async getMembership(req, rep) {
    const { params: { userId, storeId }} = req;
    this.logger.logRequest(req);

    try {
      this.logger.debug(`\tHandler: Getting membership for ${storeId}`);

      const result = await this.memberships.getMembership(userId, storeId);
      return rep.response({message: "Membership retrieved.", data: result}).code(200);
    }
    catch(err)  {
      this.logger.error(err.message);
    }
  }
}

module.exports = Handlers;
