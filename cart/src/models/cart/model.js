'use strict';

const Kernel = require('../../repository/').Kernel;
const Names = require('../../constants/modelNames');

// The data repository (database)
const Repository = require('../../repository/').Cart;

/**
 * The model for the shopping cart acts as an interface between the routes/handlers and the database.
 * It contains all data logic pertaining to the shopping cart.
 */
class CartModel {
  constructor(options = {}) {
    this.resource = Names.cart;
    this.repository = options.repository || (new Repository());
    this.logger = this.repository.logger;
  }

  /**
   * Delete all records that are related to this model (carts, products_in_cart).
   * @async
   */
  async deleteAll() {
    return this.repository.deleteAll();
  }

  /**
   * Delete a cart, also removing all products in it.
   * @async
   * @param {number} cartid - the id associated with a cart
   */
  async deleteCart(cartid) {
    return this.repository.deleteCart(cartid);
  }

  /**
   * Create a cart
   * @async
   * @param {number} cartid - the id associated with a cart
   */
  async createCart(cartid) {
    return this.repository.createCart(cartid);
  }

  /**
   * Retrieve the row containing the cart
   * @async
   * @param {number} cartid - the id associated with a cart
   */
  async getCart(cartid) {
    return this.repository.getCart(cartid);
  }

}

// binds base model to the kernel
Kernel.bind(Names.cart, CartModel);

module.exports = CartModel;
