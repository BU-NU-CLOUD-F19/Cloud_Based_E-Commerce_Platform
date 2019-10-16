/**
 * This class defines all the methods to handle calls to db for `cart` resource,
 * using query-builder tool
 */

'use strict';

const logger = require('../utils/logger');
const Names = require('../constants/modelNames');
const resource = Names.cart;
const Kernel = require('./kernel');
const knex = require('./knex');

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

  postgresDateStr() {
    return this.knex.raw(`to_timestamp(${Date.now()} / 1000.0)`);
  }


  async deleteAll() {
    try {
      const query = this.knex.raw('truncate table carts cascade');
      const result = await query;
      this.logger.debug("Successfully truncated the table.");
      return result;
    }
    catch (err) {
      this.logger.error(err.message);
    }
  }

  async getProducts(cartid) {
    // If there is a product, the cart must exist due to db constraints
    const knexBuilder = this.knex(this.resource)
    const query = knexBuilder.select('pid', 'amount_in_cart').where({cartid: cartid});
    this.logger.debug(`\tQuery: ${query}`);
    const result = await query;
    this.logger.debug(`\tRetrieved ${result.length} records.`);
    return result;
  }

  async getCart(cartid) {
    const carts = this.knex('carts');
    const checkCart = carts.select('*').where({cartid: cartid});
    this.logger.debug(`\tQuery: ${checkCart}`);
    const cartsFound = await checkCart;
    this.logger.debug(`\tResult ${JSON.stringify(cartsFound)}`);
    return cartsFound;
  }

  async createCart(cartid) {
    const carts = this.knex('carts');
    const createCart = carts.insert({
      cartid: cartid,
      date_created: this.postgresDateStr(),
      uid: 'user1' // TODO: this shouldn't be hardcoded
    }).returning('*');

    this.logger.debug(`\tQuery: ${createCart}`);
    const created = await createCart;
    this.logger.debug(`\tResult: ${created}`);
    return created;
  }

  async deleteCart(cartid) {
    await this.emptyCart(cartid);
    const carts = this.knex('carts');

    const query = carts.where({cartid: cartid}).del();
    this.logger.debug(`\tQuery: ${query}`);
    const removed = await query;
    this.logger.debug(`\tResult: ${removed}`);
    return removed;
  }

  // Add a product to the specified cart
  async addProduct(cartid, product) {
    // Set up the table reference
    const productsInCart = this.knex(this.resource);

    // Then add the product to the cart
    const addProduct = productsInCart.insert({
      cartid: cartid,
      amount_in_cart: product.amount_in_cart,
      pid: product.pid,
      date_added: this.postgresDateStr()
    }).returning(['pid', 'amount_in_cart']);

    this.logger.debug(`\tQuery: ${addProduct}`);

    return addProduct;
  }

  async removeProduct(cartid, product) {
    const productsInCart = this.knex(this.resource);

    const query = productsInCart.where({cartid: cartid, pid: product.pid}).del();
    this.logger.debug(`\tQuery: ${query}`);

    const nRowsDeleted = await query;
    this.logger.debug(`\tResult: deleted ${nRowsDeleted} rows.`);

    return nRowsDeleted;
  }

  async emptyCart(cartid) {
    const productsInCart = this.knex(this.resource);
    const query = await productsInCart.where({cartid: cartid}).del();
    this.logger.debug(`\tQuery: ${query}`);

    const nRowsDeleted = await query;
    this.logger.debug(`\tResult: deleted ${nRowsDeleted} rows.`);

    return nRowsDeleted;
  }

  async changeAmount(cartid, product) {
    const productsInCart = this.knex(this.resource);
    const query = await productsInCart.where({cartid: cartid, pid: product.pid})
                                      .update({amount_in_cart: product.amount_in_cart})
                                      .returning('*')
    this.logger.debug(`\tQuery: ${query}`);
    const res = await query;
    this.logger.debug(`\tResult ${JSON.stringify(res)}`);
    return res;
  }
}

module.exports = ShoppingCartRepository;
