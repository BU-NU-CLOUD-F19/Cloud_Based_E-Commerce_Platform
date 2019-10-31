/**
 * This class defines all the methods to handle calls to db for `cart` resource,
 * using query-builder tool
 */

'use strict';

const logger = require('../../utils/logger');
const Names = require('../../constants/modelNames');
const resource = Names.users;
const Kernel = require('../kernel');
const knex = require('../knex');
const shortid = require('shortid')

/**
 * Defines primitive functions for interacting with the PostgreSQL database.
 * They only retrieve and return data, they do not contain any data logic -- that is the responsibility of the model.
 */
class UserRepository {
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
   * Get the cart record
   * @async
   * @param {number} cartId - the id associated with a cart
   */
  async getUser(uid) {
    const query = this.knex(this.resource)
                    .select('*')
                    .where({uid});
    this.logger.debug(`\tQuery: ${query}`);

    const usersFound = await query;
    this.logger.debug(`\tResult ${JSON.stringify(usersFound)}`);
    return usersFound;
  }

  /**
   * Get the cart record
   * @async
   * @param {number} cartId - the id associated with a cart
   */
  async getUserByEmail(email) {
    const query = this.knex(this.resource)
                    .select('*')
                    .where({email});
    this.logger.debug(`\tQuery: ${query}`);

    const usersFound = await query;
    this.logger.debug(`\tResult ${JSON.stringify(usersFound)}`);
    return usersFound;
  }

  /**
   * Create a new cart
   * @async
   * @param {number} cartId - the id associated with a cart
   */
  async createUser(userData) {
    userData.uid = shortid.generate();
    userData.date_created = this.postgresDateStr();
    
    const query = this.knex(this.resource)
                    .insert(userData).returning('*');
    this.logger.debug(`\tQuery: ${query}`);

    const created = await query;
    this.logger.debug(`\tResult: ${created}`);
    return created;
  }

  /**
   * Delete a cart
   * @async
   * @param {number} id - the id associated with a cart
   */
  async deleteUser(uid) {
    const query = this.knex(this.resource)
                  .where({uid})
                  .del();
    this.logger.debug(`\tQuery: ${query}`);

    const removed = await query;
    this.logger.debug(`\tResult: ${removed}`);
    return removed;
  }

  /**
   * Delete a cart
   * @async
   * @param {number} id - the id associated with a cart
   */
  async deleteUserByEmail(email) {
    const query = this.knex(this.resource)
                  .where({email})
                  .del();
    this.logger.debug(`\tQuery: ${query}`);

    const removed = await query;
    this.logger.debug(`\tResult: ${removed}`);
    return removed;
  }

  /**
   * Update a user
   * @async
   * @param {number} uid
   * @param {object} userData
   */
  async updateUser(uid, userData) {
    const query = this.knex(this.resource)
                  .where({uid})
                  .update(userData);
    this.logger.debug(`\tQuery: ${query}`);

    const updated = await query;
    this.logger.debug(`\tResult: ${updated}`);
    return updated;
  }
}

module.exports = UserRepository;
