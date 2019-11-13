'use strict';

const Kernel = require('../../repository/').Kernel;
const Names = require('../../constants/modelNames');

// The data repository (database)
const Repository = require('../../repository/').Users;

/**
 * The model for the user security group acts as an interface between the routes/handlers and the database.
 */
class UsersModel {
  constructor(options = {}) {
    this.resource = Names.users;
    this.repository = options.repository || (new Repository());
    this.logger = this.repository.logger;
  }

  /**
   * Delete all records that are related to this model
   * @async
   */
  async deleteAll() {
    return this.repository.deleteAll();
  }

  /**
   * Delete a user
   * @async
   * @param {number} userId - the id of the associated user
   */
  async deleteUser(userId) {
    return this.repository.deleteUser(userId);
  }

  /**
   * Delete a user by their email
   * @async
   * @param {String} email - the email of the user to be deleted
   */
  async deleteUserByEmail(email) {
    return this.repository.deleteUserByEmail(email);
  }

  /**
   * Create a user
   * @async
   * @param {object} userData
   */
  async createUser(userData) {
    // TODO: Create user security group record in this flow
    return this.repository.createUser(userData);
  }

  /**
   * Retrieve the user
   * @async
   * @param {number} userId
   */
  async getUser(userId) {
    return this.repository.getUser(userId);
  }

  /**
   * Retrieve the user by their email
   * @async
   * @param {String} email
   */
  async getUserByEmail(email) {
    return this.repository.getUserByEmail(email);
  }

  /**
   * Update the user
   * @async
   * @param {number} userId
   * @param {object} userData
   */
  async updateUser(userId, userData) {
    const result = await this.repository.updateUser(userId, userData);
    return result;
  }
}

// binds base model to the kernel
Kernel.bind(Names.users, UsersModel);

module.exports = UsersModel;
