/**
 * These are the handlers for the endpoints for the cart.
 * It's the code that actually contains the logic for each endpoint.
 */

'use strict';

const logger = require('../../utils/logger');
const { SecurityGroups } = require('../../models/');

/**
 * The handler functions for all endpoints defined for the cart
 */
class Handlers {
  constructor() {
    this.securityGroups = new SecurityGroups();
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
   * get all the security-groups
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async getSecurityGroup(req, rep) {
    this.logger.logRequest(req);

    try {
      this.logger.debug(`\tHandler: Listing all securityGroups`);

      // Get the products in the cart and return them
      const result = await this.securityGroups.getSecurityGroup();
      return rep.response({message: "Products retrieved.", data: result}).code(200);
    }
    catch(err)  {
      this.logger.error(err.message);
    }
  }
}

module.exports = Handlers;
