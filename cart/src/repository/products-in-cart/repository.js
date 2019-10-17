/**
 * This class defines all the methods to handle calls to db for `products_in_cart` resource,
 * using query-builder tool
 */

'use strict';

const logger = require('../../utils/logger');
const Names = require('../../constants/modelNames');
const resource = Names.productsInCart;
const Kernel = require('../kernel');
const knex = require('../knex');

/**
 * Defines primitive functions for interacting with the PostgreSQL database.
 * They only retrieve and return data, they do not contain any data logic -- that is the responsibility of the model.
 */
class ProductsInCartRepository {
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
   * Get products in a cart
   * @async
   * @param {number} cartId - the id associated with a cart
   */
  async getProducts(cartId) {
    // If there is a product, the cart must exist due to db constraints, so we don't check that here.
    const knexBuilder = this.knex(this.resource);
    const query = knexBuilder.select('pid', 'amount_in_cart').where({cart_id: cartId});
    this.logger.debug(`\tQuery: ${query}`);

    const result = await query;
    this.logger.debug(`\tRetrieved ${result.length} records.`);
    return result;
  }


  /**
   * Add a product to the specified cart
   *
   * @async
   * @param {number} cartId - the id associated with a cart
   * @param {object} product - the product to add, containing at least the fields 'pid' and 'amount_in_cart'
   */
  async addProduct(cartId, product) {
    // Set up the table reference
    const productsInCart = this.knex(this.resource);

    const productData = {
      cart_id: cartId,
      amount_in_cart: product.amount_in_cart,
      pid: product.pid,
      date_added: this.postgresDateStr()
    }

    // Then add the product to the cart
    const addProduct = productsInCart.insert(productData).returning(['pid', 'amount_in_cart']);
    this.logger.debug(`\tQuery: ${addProduct}`);

    return addProduct;
  }

  /**
   * Remove a product from a cart
   * @async
   * @param {number} cartId - the id associated with a cart
   * @param {object} product - the product to remove, containing at least the field 'pid'
   */
  async removeProduct(cartId, product) {
    const productsInCart = this.knex(this.resource);

    const query = productsInCart.where({cart_id: cartId, pid: product.pid}).del();
    this.logger.debug(`\tQuery: ${query}`);

    const nRowsDeleted = await query;
    this.logger.debug(`\tResult: deleted ${nRowsDeleted} rows.`);

    return nRowsDeleted;
  }

  /**
   * Empty a cart (remove all products from it)
   * @async
   * @param {number} cartId - the id associated with a cart
   */
  async emptyCart(cartId) {
    const productsInCart = this.knex(this.resource);
    const query = await productsInCart.where({cart_id: cartId}).del();
    this.logger.debug(`\tQuery: ${query}`);

    const nRowsDeleted = await query;
    this.logger.debug(`\tResult: deleted ${nRowsDeleted} rows.`);

    return nRowsDeleted;
  }

  /**
   * Change the amount of a product in a cart.
   * @async
   * @param {number} cartId - the id associated with a cart
   * @param {object} product - the product to change, containing at least the fields 'pid' and 'amount_in_cart'
   */
  async changeAmount(cartId, product) {
    const productsInCart = this.knex(this.resource);
    const query = productsInCart.where({cart_id: cartId, pid: product.pid})
                                      .update({amount_in_cart: product.amount_in_cart})
                                      .returning(['pid', 'amount_in_cart'])
    this.logger.debug(`\tQuery: ${query}`);

    const res = await query;
    this.logger.debug(`\tResult ${JSON.stringify(res)}`);
    return res;
  }
}

module.exports = ProductsInCartRepository;
