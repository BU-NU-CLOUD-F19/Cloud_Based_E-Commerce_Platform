'use strict';

const Kernel = require('../../repository/').Kernel;
const Names = require('../../constants/modelNames');

// The data repository (database)
const Repository = require('../../repository/').ProductsInCart;

/**
 * The model managing the products in carts.
 */
class ProductsInCartModel {
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
      return this.repository.emptyCart(cartid);
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
}

// binds base model to the kernel
Kernel.bind(Names.cart, ProductsInCartModel);

module.exports = ProductsInCartModel;
