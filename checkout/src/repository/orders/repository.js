/**
 * This class defines all the methods to handle calls to db for `checkout` resource,
 * using query-builder tool
 */

'use strict';

const logger = require('../../utils/logger');
const Names = require('../../constants/modelNames');
const resource = Names.orders;
const Kernel = require('../kernel');
const knex = require('../knex');

/**
 * Defines primitive functions for interacting with the PostgreSQL database.
 * They only retrieve and return data, they do not contain any data logic -- that is the responsibility of the model.
 */
class OrdersRepository {
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

  async createOrder(details) {
    const orders = this.knex(this.resource);

    const order = {
      total_price: details.total_price,
      date: this.postgresDateStr(),
      destination: details.destination,
      shipping: details.shipping,
      uid: details.uid
    }

    const query = orders.insert(order).returning('*');
    this.logger.debug(`\tQuery: ${query}`);
    const result = await query;
    this.logger.debug(`\tResult: ${JSON.stringify(result)}`);

    return result[0];

  }


}

module.exports = OrdersRepository;
