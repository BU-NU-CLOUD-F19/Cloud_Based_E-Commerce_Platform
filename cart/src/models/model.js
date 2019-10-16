'use strict';

const Kernel = require('./kernel');
const Names = require('../constants/modelNames');

// The data repository (database)
const Repository = require('./repository');

/**
 * The model for the shopping cart acts as an interface between the routes/handlers and the database.
 * It contains all data logic pertaining to the shopping cart.
 */
class ShoppingCartModel {
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
   * Get all products in a cart.
   * @async
   * @param {number} cartid - the id associated with a cart
   */
  async getProducts(cartid) {
    return this.repository.getProducts(cartid);
  }

  /**
   * Add a product to a cart.
   * @async
   * @param {number} cartid - the id associated with a cart
   * @param {object} product - an object describing the product, containing at least the fields 'pid', 'amount_in_cart'
   */
  async addProduct(cartid, product) {
    // Check if the cart already exists
    const cartRow = await this.repository.getCart(cartid);

    // Create it if it doesn't
    if (cartRow.length === 0) {
      await this.repository.createCart(cartid);
    }

    // Add the product and return it
    return this.repository.addProduct(cartid, product);
  }

  /**
   * Remove a product from a cart
   * @async
   * @param {number} cartid - the id associated with a cart
   * @param {object} product - an object describing the product, containing at least the field 'pid'.
   */
  async removeProduct(cartid, product) {
    return this.repository.removeProduct(cartid, product);
  }

  /**
   * Empty the cart, removing all products
   * @async
   * @param {number} cartid - the id associated with a cart
   */
  async emptyCart(cartid) {
    const cartRow = await this.repository.getCart(cartid);

    if (cartRow.length === 0) {
      throw new ReferenceError("Cart doesn't exist");
    }
    else {
      return this.repository.emptyCart(cartid);
    }
  }

  /**
   * Change the amount of a product in a cart
   * @async
   * @param {number} cartid - the id associated with a cart
   * @param {object} product - an object describing the product, containing at least the fields 'pid', 'amount_in_cart'
   */
  async changeAmount(cartid, product) {
    return this.repository.changeAmount(cartid, product);
  }

  /**
   * Delete a cart, also removing all products in it.
   * @async
   * @param {number} cartid - the id associated with a cart
   */
  async deleteCart(cartid) {
    // Check if the cart exists
    //  (doing this as a preliminary check reduces the amount of db queries)
    const cartRow = await this.repository.getCart(cartid);

    // If it doesn't, return 0 records deleted, which makes the route handler generate an error
    if (cartRow.length === 0) {
      return 0;
    }

    // If it does, delete it
    return this.repository.deleteCart(cartid);
  }
}

// binds base model to the kernel
Kernel.bind(Names.cart, ShoppingCartModel);

module.exports = ShoppingCartModel;
