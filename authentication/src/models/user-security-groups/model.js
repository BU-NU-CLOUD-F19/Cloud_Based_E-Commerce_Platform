'use strict';

const Kernel = require('../../repository/').Kernel;
const Names = require('../../constants/modelNames');

// The data repository (database)
const Repository = require('../../repository/').UserSecurityGroups;

/**
 * The model for the user security group acts as an interface between the routes/handlers and the database.
 */
class UserSecurityGroupModel {
  constructor(options = {}) {
    this.resource = Names.userSecurityGroups;
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
   * Delete all user security groups for a user
   * @async
   * @param {number} userId - the id of the associated user
   */
  async deleteUSGroupByUserId(userId) {
    return this.repository.deleteUSGroupByUserId(userId);
  }

  /**
   * Delete all user security groups for a store
   * @async
   * @param {number} storeId - the id of the associated store
   */
  async deleteUSGroupByStoreId(storeId) {
    return this.repository.deleteUSGroupByStoreId(storeId);
  }

  /**
   * Create a user security group record
   * @async
   * @param {number} userId
   * @param {number} storeId
   * @param {number} securityGroupId
   */
  async createUSGroup(userId, storeId, securityGroupId) {
    return this.repository.createUSGroup(userId, storeId, securityGroupId);
  }

  /**
   * Retrieve the user security group
   * @async
   * @param {number} userId
   * @param {number} storeId
   */
  async getUSGroupByUserIdStoreId(userId, storeId) {
    return this.repository.getUSGroup(userId, storeId);
  }

}

// binds base model to the kernel
Kernel.bind(Names.userSecurityGroups, UserSecurityGroupModel);

module.exports = UserSecurityGroupModel;
