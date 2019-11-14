'use strict';

const Kernel = require('../../repository/').Kernel;
const Names = require('../../constants/modelNames');

// The data repository (database)
const Repository = require('../../repository/').Memberships;

/**
 * The model for the membership acts as an interface between the routes/handlers and the database.
 * It contains all business logic pertaining to the membership.
 */
class MembershipsModel {
  constructor(options = {}) {
    this.resource = Names.memberships;
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
   * Delete a Membership of a user in a store
   * @async
   * @param {number} storeId - the id of the store of which user is a member
   * @param {number} userId - the id of the user whose membership is to be deleted
   */
  async deleteMembership(storeId, userId) {
    return this.repository.deleteMembership(storeId, userId);
  }

  /**
   * Delete all Memberships of a user
   * @async
   * @param {number} userId - the id of the user whose memberships are to be deleted
   */
  async deleteMembershipsByUserId(userId) {
    return this.repository.deleteMembershipsByUserId(userId);
  }

  /**
   * Delete all Memberships of a store
   * @async
   * @param {number} storeId - the id of the store whose membership is to be deleted
   */
  async deleteMembershipsByStoreId(storeId) {
    return this.repository.deleteMembershipsByStoreId(storeId);
  }

  /**
   * Create a membership
   * @async
   * @param {number} userId
   * @param {number} storeId
   * @param {number} subscriptionStatus - status for email notifications
   */
  async createMembership(userId, storeId, subscriptionStatus) {
    const res = await this.getMembership(storeId, userId);
    if (res.length > 0) {
      return res;
    }
    return this.repository.createMembership(userId, storeId, subscriptionStatus);
  }

  /**
   * Retrieve the row containing the userId and storeId
   * @async
   * @param {number} storeId
   * @param {number} userId
   */
  async getMembership(storeId, userId) {
    return this.repository.getMembership(storeId, userId);
  }

  /**
   * Update the subscription status of a membership
   * @async
   * @param {number} id
   * @param {boolean} isSubscribed - status of email notifications
   */
  async updateMembershipSubscription(id, isSubscribed) {
    return this.repository.updateSubscription(id, isSubscribed);
  }

}

// binds base model to the kernel
Kernel.bind(Names.memberships, MembershipsModel);

module.exports = MembershipsModel;
