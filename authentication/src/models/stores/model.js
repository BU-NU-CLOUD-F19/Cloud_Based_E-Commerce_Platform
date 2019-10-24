'use strict';

const Kernel = require('../../repository/').Kernel;
const Names = require('../../constants/modelNames');

// The data repository (database)
const Repository = require('../../repository/').Cart;

/**
 * The model for the shopping cart acts as an interface between the routes/handlers and the database.
 * It contains all data logic pertaining to the shopping cart.
 */
class StoreModel {
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
   * Delete a Store, also removing all of its members
   * @async
   * @param {number} storeId - the id of the store to be deleted
   */
  async deleteCart(storeId) {
    return this.repository.deleteCart(storeId);
  }

  /**
   * Create a store
   * @async
   * @param {number} storeId - the id associated with a store
   */
  async createStore(name, phone, email) {
    return this.repository.createStore(name, phone, email);
  }

  /**
   * Retrieve the store by storeId
   * @async
   * @param {number} storeId - the id associated with a cart
   */
  async getStoreById(storeId) {
    return this.repository.getStoreById(storeId);
  }

  /**
   * Retrieve the store by its email
   * @async
   * @param {number} storeEmail - the id associated with a cart
   */
  async getStoreByEmail(storeEmail) {
    return this.repository.getStore(storeEmail);
  }
}

// binds base model to the kernel
Kernel.bind(Names.cart, CartModel);

module.exports = CartModel;
