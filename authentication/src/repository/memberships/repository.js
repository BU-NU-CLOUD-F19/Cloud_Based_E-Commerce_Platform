/**
 * This class defines all the methods to handle calls to db for `memberships` resource,
 * using query-builder tool
 */

'use strict';

const logger = require('../../utils/logger');
const Names = require('../../constants/modelNames');
const resource = Names.memberships;
const Kernel = require('../kernel');
const knex = require('../knex');

/**
 * Defines primitive functions for interacting with the PostgreSQL database.
 * They only retrieve and return data, they do not contain any data logic -- that is the responsibility of the model.
 */
class MembershipRepository {
  constructor(options = {}) {
    const knexManager = Kernel.resolve(Names.knexManager);
    this.knex = knexManager.knex;
    if (!this.knex) {
      const {
        connection,
        pool = { min: 2, max: 7 },
      } = options;
      this.knex = knex(connection, pool);
    }

    this.logger = logger;
    this.resource = resource;
  }

  /**
   * Inserts the current date and time into Postgres by generating a string that calls a Postgres function.
   */
  postgresDateStr() {
    // Need to use knex.raw() to call Postgres functions
    // Date.now() returns milliseconds, while Postgres to_timestamp() accepts seconds, so need to divide.
    return this.knex.raw(`to_timestamp(${Date.now()} / 1000.0)`);
  }


  /**
   * Delete all memberships
   * @async
   */
  async deleteAll() {
    try {
      // Knex doesn't provide a way to cascade, so have to use a raw query
      const query = this.knex.raw(`TRUNCATE TABLE ${this.resource} CASCADE`);
      const result = await query;

      this.logger.debug("Successfully truncated the table.");
      return result;
    }
    catch (err) {
      this.logger.error(err.message);
    }
  }

  /**
   * Get the membership record
   * @async
   * @param {String} storeId
   * @param {String} userId
   */
  async getMembership(storeId, userId) {
    const memberships = this.knex(this.resource);
    const id = `${userId}:${storeId}`;
    const getMemberships = memberships.select('*').where({id});
    this.logger.debug(`\tQuery: ${getMemberships}`);

    const membershipsFound = await getMemberships;
    this.logger.debug(`\tResult ${JSON.stringify(membershipsFound)}`);
    return membershipsFound;
  }

  /**
   * Create a new membership
   * @async
   * @param {String} userId
   * @param {String} storeId
   * @param {Boolean} subscriptionStatus
   */
  async createMembership(userId, storeId, subscriptionStatus) {
    const memberships = this.knex(this.resource);
    const membershipData = {
      id: `${userId}:${storeId}`, // making sure there is only one membership per user per store
      user_id: userId,
      store_id: storeId,
      subscription_status: subscriptionStatus,
      date_created: this.postgresDateStr()
    };

    const createMembership = memberships.insert(membershipData).returning('*');
    this.logger.debug(`\tQuery: ${createMembership}`);

    const created = await createMembership;
    this.logger.debug(`\tResult: ${created}`);
    return created;
  }

  /**
   * Delete a Membership
   * @async
   * @param {number} storeId
   * @param {number} userId
   */
  async deleteMembership(storeId, userId) {
    const memberships = this.knex(this.resource);
    const id = `${userId}:${storeId}`;
    const query = memberships.where({id})
                              .del();
    this.logger.debug(`\tQuery: ${query}`);

    const removed = await query;
    this.logger.debug(`\tResult: ${removed}`);
    return removed;
  }

  /**
   * Delete a Membership by User
   * @async
   * @param {number} userId
   */
  async deleteMembershipByUserId(userId) {
    const memberships = this.knex(this.resource);
    const query = memberships.where({user_id: userId})
                              .del();
    this.logger.debug(`\tQuery: ${query}`);

    const removed = await query;
    this.logger.debug(`\tResult: ${removed}`);
    return removed;
  }

  /**
   * Delete a Membership by Store
   * @async
   * @param {number} storeId
   */
  async deleteMembershipByStoreId(storeId) {
    const memberships = this.knex(this.resource);
    const query = memberships.where({store_id: storeId})
                              .del();
    this.logger.debug(`\tQuery: ${query}`);

    const removed = await query;
    this.logger.debug(`\tResult: ${removed}`);
    return removed;
  }

  /**
   * Update subscription
   * @async
   * @param {String} id
   * @param {Boolean} subscriptionStatus
   */
  async updateSubscription(id, subscriptionStatus) {
    const query = this.knex(this.resource)
                  .where({id})
                  .update({ subscription_status: subscriptionStatus});
    this.logger.debug(`\tQuery: ${query}`);

    const updated = await query;
    this.logger.debug(`\tResult: ${updated}`);
    return updated;
  }
}

module.exports = MembershipRepository;
