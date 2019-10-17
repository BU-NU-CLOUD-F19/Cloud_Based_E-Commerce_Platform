/**
 * This class defines all the methods to handle calls to db for `cart` resource,
 * using query-builder tool
 */

'use strict';

const logger = require('../../utils/logger');
const Names = require('../../constants/modelNames');
const resource = Names.cart;
const Kernel = require('../kernel');
const knex = require('../knex');

/**
 * Defines primitive functions for interacting with the PostgreSQL database.
 * They only retrieve and return data, they do not contain any data logic -- that is the responsibility of the model.
 */
class ShoppingCartRepository {
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
   * @param {number} cartid - the id associated with a cart
   */
  async getCart(cartid) {
    const carts = this.knex(this.resource);
    const checkCart = carts.select('*').where({cartid});
    this.logger.debug(`\tQuery: ${checkCart}`);

    const cartsFound = await checkCart;
    this.logger.debug(`\tResult ${JSON.stringify(cartsFound)}`);
    return cartsFound;
  }

  /**
   * Create a new cart
   * @async
   * @param {number} cartid - the id associated with a cart
   */
  async createCart(cartid) {
    const carts = this.knex(this.resource);

    const cartData = {
      cartid,
      date_created: this.postgresDateStr(),
      uid: 'user1' // TODO: this shouldn't be hardcoded
    }

    const createCart = carts.insert(cartData).returning('*');
    this.logger.debug(`\tQuery: ${createCart}`);

    const created = await createCart;
    this.logger.debug(`\tResult: ${created}`);
    return created;
  }

  /**
   * Delete a cart
   * @async
   * @param {number} cartid - the id associated with a cart
   */
  async deleteCart(cartid) {
    // Check if the cart exists
    //  (doing this as a preliminary check reduces the amount of db queries)
    const cartRow = await this.getCart(cartid);
    if (cartRow.length === 0) {
      return 0;
    }

    const carts = this.knex(this.resource);
    const query = carts.where({cartid}).del();
    this.logger.debug(`\tQuery: ${query}`);

    const removed = await query;
    this.logger.debug(`\tResult: ${removed}`);
    return removed;
  }
}

module.exports = ShoppingCartRepository;
