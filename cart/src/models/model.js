/**
 * This class defines all the base methods for data/storage retrieval for a resource.
 */

'use strict';

const Kernel = require('./kernel');
const Names = require('../constants/modelNames');

// The data repository (database)
const Repository = require('./repository');

class ShoppingCartModel {
  constructor(options = {}) {
    this.resource = Names.cart; // the name of the resource inheriting this class
    this.repository = options.repository || (new Repository()); // the repository of the resource inheriting this class
    this.logger = this.repository.logger;
  }

  async deleteAll() {
    return this.repository.deleteAll();
  }

  async getProducts(cartid) {
    return this.repository.getProducts(cartid);
  }

  async addProduct(cartid, product) {
    // Check if the cart already exists
    const cartRow = await this.repository.getCart(cartid);

    // Create it if it doesn't
    if (cartRow.length === 0) {
      await this.repository.createCart(cartid);
    }

    return this.repository.addProduct(cartid, product);
  }

  async removeProduct(cartid, product) {
    return this.repository.removeProduct(cartid, product);
  }

  async emptyCart(cartid) {
    return this.repository.emptyCart(cartid);
  }

  async changeAmount(cartid, product) {
    return this.repository.changeAmount(cartid, product);
  }

  async deleteCart(cartid) {
    // Check if the cart exists
    //  (doing this preliminary reduces the amount of db queries in case of error)
    const cartRow = await this.repository.getCart(cartid);

    // If it doesn't, error
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
