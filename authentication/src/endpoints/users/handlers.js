/**
 * These are the handlers for the endpoints for the users.
 * It's the code that actually contains the logic for each endpoint.
 */

'use strict';

const logger = require('../../utils/logger');
const { Users } = require('../../models/');

/**
 * The handler functions for all endpoints defined for the users
 */
class Handlers {
  constructor() {
    this.users = new Users();
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
   * Create a user.
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async createUser(req, rep) {
    this.logger.logRequest(req);
    const { payload } = req;

    // Check if request contains a body
    if (!payload) {
      return rep.response({message: "Body cannot be empty."}).code(400);
    }

    // Check if request body contains the required values
    const isValid = Handlers.propsPresent(['fname', 'lname', 'email', 'phone', 'address'], payload);
    if (!isValid.valid) {
      return rep.response({message: `${isValid.missing} not specified.`}).code(400);
    }

    this.logger.debug(`\tHandler: Creating user ${JSON.stringify(payload)}`);

    try {

      const res = await this.users.createUser(payload);
      this.logger.debug(`\tResult: ${JSON.stringify(res)}`);

      // Return what was added
      return rep.response({message: "User created.", data: res}).code(201);
    }

    // Catch any database errors (e.g. product not found) and return the appropriate response
    catch (err) {
      this.logger.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Remove a user
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async deleteUser(req, rep) {
    this.logger.logRequest(req);
    const { params: { id } } = req;

    this.logger.debug(`\tHandler: Deleting user ${id}`);

    try {
      const res = await this.users.deleteUser(id);
      this.logger.debug(`\tResult: ${JSON.stringify(res)}`);

      // If no rows were removed, respond with a 400.
      if (res === 0) {
        return rep.response({message: `User ${id} not found.`}).code(400);
      }
      else {
        // Otherwise, return  how many rows were removed
        return rep.response({message: `User ${id} deleted.`, data: res}).code(200);
      }
    }
    catch (err) {
      this.logger.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Update a user
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async updateUser(req, rep) {
    this.logger.logRequest(req);
    const { params: { id }, payload } = req;

    // Check if request contains a body
    if (!payload) {
      return rep.response({message: "Body cannot be empty."}).code(400);
    }

    this.logger.debug(`\tHandler: Updating user ${id}`);

    try {
      // Update the user
      const res = await this.users.updateUser(id, payload);

      // Return the new product record
      if (res.length > 0) {
        return rep.response({message: "User updated.", data: res});
      }
      // If nothing was updated, the product wasn't in the users.
      else {
        return rep.response({message: `No such user ${id} found.`}).code(400);
      }
    }
    // Catch database errors
    catch(err) {
      this.logger.error(JSON.stringify(err));
    }

  }

  /**
   * Get a user by their email
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async getUserByEmail(req, rep) {
    const { params: { email }} = req;
    this.logger.logRequest(req);

    try {
      this.logger.debug(`\tHandler: Get user with email ${email}`);

      const result = await this.users.getUserByEmail(email);
      return rep.response({message: "User retrieved.", data: result}).code(200);
    }
    catch(err)  {
      this.logger.error(err.message);
    }
  }

  /**
   * Get a user with their id
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async getUser(req, rep) {
    const { params: { id }} = req;
    this.logger.logRequest(req);

    try {
      this.logger.debug(`\tHandler: Get user with id ${id}`);
      const result = await this.users.getUser(id);
      return rep.response({message: "User retrieved.", data: result}).code(200);
    }
    catch(err)  {
      this.logger.error(err.message);
    }
  }
}

module.exports = Handlers;
