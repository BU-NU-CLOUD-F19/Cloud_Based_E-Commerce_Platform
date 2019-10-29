/**
 * This class defines all the methods to handle calls to db for `cart` resource,
 * using query-builder tool
 */

'use strict';

const logger = require('../../utils/logger');
const Names = require('../../constants/modelNames');
const resource = Names.userSecurityGroups;
const Kernel = require('../kernel');
const knex = require('../knex');
const shortid = require('shortid')

/**
 * Defines primitive functions for interacting with the PostgreSQL database.
 * They only retrieve and return data, they do not contain any data logic -- that is the responsibility of the model.
 */
class UserSecurityGroupRepository {
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
   * Delete all carts and their products
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
   * Get the user security group
   * @async
   * @param {number} userId
   * @param {number} storeId
   */
  async getUserSecurityGroup(userId, storeId) {
    const query = this.knex(this.resource)
                  .select('*')
                  .where({store_id: storeId, user_id: userId});
    this.logger.debug(`\tQuery: ${query}`);

    const cartsFound = await query;
    this.logger.debug(`\tResult ${JSON.stringify(cartsFound)}`);
    return cartsFound;
  }

  /**
   * Create a new cart
   * @async
   * @param {string} userId
   * @param {string} storeId
   * @param {string} securityGroupId
   */
  async createUSGroup(userId, storeId, securityGroupId) {
    const uSGroup = this.knex(this.resource);

    const uSGroupData = {
      id: shortid.generate(),
      user_id: userId,
      store_id: storeId,
      security_group_id: securityGroupId,
      date_created: this.postgresDateStr()
    }

    const query = uSGroup.insert(uSGroupData).returning('*');
    this.logger.debug(`\tQuery: ${query}`);

    const created = await query;
    this.logger.debug(`\tResult: ${created}`);
    return created;
  }

  /**
   * Delete a cart
   * @async
   * @param {number} userID - the id associated with a cart
   */
  async deleteUSGroup(userId, storeId) {
    const carts = this.knex(this.resource)
                    .where({user_id: userId, store_id: storeId})
                    .del();
    this.logger.debug(`\tQuery: ${query}`);

    const removed = await query;
    this.logger.debug(`\tResult: ${removed}`);
    return removed;
  }

  /**
   * Delete a cart
   * @async
   * @param {number} userID - the id associated with a cart
   */
  async deleteUSGroupByUserId(userId) {
    const carts = this.knex(this.resource)
                    .where({user_id: userId}).del();
    this.logger.debug(`\tQuery: ${query}`);

    const removed = await query;
    this.logger.debug(`\tResult: ${removed}`);
    return removed;
  }
}

module.exports = UserSecurityGroupRepository;
