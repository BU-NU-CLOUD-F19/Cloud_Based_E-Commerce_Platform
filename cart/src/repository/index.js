/**
 * This is the repository class which talks to the database for all
 * the storage and retrieval functions
 */

'use strict';

const logger = require('../utils/logger');
const knex = require('./knex');

class PostgreSqlRepository {

  constructor(options = {}) {
    this.knex = options.knex;
    if (!this.knex) {
      const {
        connection,
        pool = { min: 2, max: 7 },
      } = options;
      this.knex = knex(connection, pool);
    }

    this.logger = options.logger || logger;
    this.resource = options.resource;
  }

  deleteAll() {
    const query = this.knex.raw('truncate table carts cascade');
    return query
      .then((result) => {
        this.logger.debug("Successfully truncated the table.")
        return result;
      })
      .catch((err) => {
        this.logger.error(err.message);
      })
  }

  getProducts(cartid) {
    // If there is a product, the cart must exist due to db constraints
    const knexBuilder = this.knex(this.resource)
    const query = knexBuilder.select('pid', 'amount_in_cart').where({cartid: cartid});
    this.logger.debug(`Query: ${query}`);
    return query
      .then(result => {
        this.logger.debug(`Retrieved ${result.length} records.`);
        return result;
      })
    .catch(err => {
      this.logger.error(err.message);
    })
  }
}

module.exports = PostgreSqlRepository;

