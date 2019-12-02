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
   * Update the cart's modified time field in the database
   * @async
   * @param {number} cartId - the id associated with a cart
   */
  async modified(cartId) {
    return this.repository.modified(cartId);
  }

  /**
   * Delete a cart, also removing all products in it.
   * @async
   * @param {number} cartId - the id associated with a cart
   */
  async deleteCart(cartId) {
    return this.repository.deleteCart(cartId);
  }

  /**
   * Create a cart
   * @async
   * @param {number} cartId - the id associated with a cart
   */
  async createCart(cartId, as) {
    return this.repository.createCart(cartId, as);
  }

  /**
   * Retrieve the row containing the cart
   * @async
   * @param {number} cartId - the id associated with a cart
   */
  async getCart(cartId) {
    return this.repository.getCart(cartId);
  }

  /**
   * Lock a cart
   * @async
   * @param {number} cartId - the id associated with a cart
   */
  async lockCart(cartId) {
    return this.repository.lockCart(cartId);
  }

  /**
   * Unlock a cart
   * @async
   * @param {number} cartId - the id associated with a cart
   */
  async unlockCart(cartId) {
    return this.repository.unlockCart(cartId);
  }

  /**
   * Check if a cart is locked
   * @async
   * @param {number} cartId - the id associated with a cart
   */
  async isLocked(cartId) {
    return this.repository.isLocked(cartId);
  }

  /**
   * Start the checkout for a cart
   * @async
   * @param {number} cartId - the id associated with a cart
   */
  async beginCheckout(cartId) {
    await this.repository.updateCheckoutTime(cartId);
    return this.repository.lockCart(cartId);
  }

  /**
   * End the checkout process for a cart
   * @async
   * @param {number} cartId - the id associated with a cart
   */
  async endCheckout(cartId) {
    await this.repository.unlockCart(cartId);
    return this.repository.clearCheckoutTime(cartId);
  }

}

// binds base model to the kernel
Kernel.bind(Names.cart, CartModel);

module.exports = CartModel;
