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
    this.logger.debug(`\tQuery: ${query}`);
    return query
      .then(result => {
        this.logger.debug(`\tRetrieved ${result.length} records.`);
        return result;
      })
    .catch(err => {
      this.logger.error(err.message);
    })
  }

  // Add a product to the specified cart
  addProduct(cartid, product) {
    // Set up the table references
    const carts = this.knex('carts');
    const productsInCart = this.knex(this.resource);


    // Check if the cart exists
    const checkCart = carts.select('cartid').where({cartid: cartid});
    return checkCart
      .then(res => {
        this.logger.debug(`\tQuery: ${checkCart}`);

        // If it does not
        if (res.length === 0) {
          this.logger.debug(`\tResult ${JSON.stringify(res)}`);

          const createCart = carts.insert({
            cartid: cartid,
            date_created: this.knex.raw(`to_timestamp(${Date.now()} / 1000.0)`),
            uid: 'user1' // TODO: this shouldn't be hardcoded
          }).returning('*');

          this.logger.debug(`\tQuery: ${createCart}`);

          // Return a promise creating the cart
          return createCart;
        }
        else {
          // Otherwise, return a promise with the cart
          return Promise.resolve(res)
        }
      })
      .then(res => {
        this.logger.debug(`\tResult: ${JSON.stringify(res)}`);

        // Then add the product to the cart
        const addProduct = productsInCart.insert({
          cartid: cartid,
          amount_in_cart: product.amount_in_cart,
          pid: product.pid,
          date_added: this.knex.raw(`to_timestamp(${Date.now()} / 1000.0)`)
        }).returning(['pid', 'amount_in_cart']);

        this.logger.debug(`\tQuery: ${addProduct}`);

        // And return the promise (since each function here has to return a promise)
        return addProduct;
      })
  }
}

module.exports = PostgreSqlRepository;

