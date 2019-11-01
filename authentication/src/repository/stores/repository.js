/**
 * This class defines all the methods to handle calls to db for `stores` resource,
 * using query-builder tool
 */

'use strict';

const logger = require('../../utils/logger');
const Names = require('../../constants/modelNames');
const resource = Names.stores;
const Kernel = require('../kernel');
const knex = require('../knex');
const shortid = require('shortid');

/**
 * Defines primitive functions for interacting with the PostgreSQL database.
 * They only retrieve and return data, they do not contain any data logic -- that is the responsibility of the model.
 */
class StoresRepository {
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
   * Delete all storess and their products
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
   * Get the store by id
   * @async
   * @param {string} id
   */
  async getStoreById(id) {
    const stores = this.knex(this.resource);
    const query = stores.select('*').where({id});
    this.logger.debug(`\tQuery: ${query}`);

    const store = await query;
    this.logger.debug(`\tResult ${JSON.stringify(store)}`);
    return store;
  }

  /**
   * Get the store by email
   * @async
   * @param {string} email
   */
  async getStoreByEmail(email) {
    const stores = this.knex(this.resource);
    const query = stores.select('*').where({email});
    this.logger.debug(`\tQuery: ${query}`);

    const store = await query;
    this.logger.debug(`\tResult ${JSON.stringify(store)}`);
    return store;
  }

  /**
   * Create a new store
   * @async
   * @param {object} storeData
   */
  async createStore(storeData) {
    const stores = this.knex(this.resource);
    storeData.id = shortid.generate(),
    storeData.date_created = this.postgresDateStr();

    const query = stores.insert(storeData).returning('*');
    this.logger.debug(`\tQuery: ${query}`);

    const created = await query;
    this.logger.debug(`\tResult: ${created}`);
    return created;
  }

  /**
   * Delete a stores
   * @async
   * @param {String} id
   */
  async deleteStore(id) {
    const stores = this.knex(this.resource);
    const query = stores.where({id}).del();
    this.logger.debug(`\tQuery: ${query}`);

    const removed = await query;
    this.logger.debug(`\tResult: ${removed}`);
    return removed;
  }
}

module.exports = StoresRepository;
