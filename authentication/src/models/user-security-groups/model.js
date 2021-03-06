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
   * Delete all user security groups for a store
   * @async
   * @param {String} storeId - the id of the associated store
   */
  async deleteUSGroup(userId, storeId) {
    return this.repository.deleteUSGroup(userId, storeId);
  }


  /**
   * Delete all user security groups for a user
   * @async
   * @param {String} userId - the id of the associated user
   */
  async deleteUSGroupByUserId(userId) {
    return this.repository.deleteUSGroupByUserId(userId);
  }

  /**
   * Delete all user security groups for a store
   * @async
   * @param {String} storeId - the id of the associated store
   */
  async deleteUSGroupByStoreId(storeId) {
    return this.repository.deleteUSGroupByStoreId(storeId);
  }

  /**
   * Create a user security group record
   * @async
   * @param {String} userId
   * @param {String} storeId
   * @param {String} securityGroupId
   */
  async createUserSecurityGroup(userId, storeId, securityGroupId) {
    // TODO: add logic to fetch scope somewhere along this flow
    return this.repository.createUSGroup(userId, storeId, securityGroupId);
  }

  /**
   * Retrieve the user security group
   * @async
   * @param {String} userId
   * @param {String} storeId
   */
  async getUSGroupByUserIdStoreId(userId, storeId) {
    return this.repository.getUserSecurityGroup(userId, storeId);
  }

}

// binds base model to the kernel
Kernel.bind(Names.userSecurityGroups, UserSecurityGroupModel);

module.exports = UserSecurityGroupModel;
