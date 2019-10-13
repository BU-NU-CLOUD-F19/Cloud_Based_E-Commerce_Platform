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

  getProducts(cartid) {
    return this.repository.getProducts(cartid);
  }

  async addProduct(cartid, product) {
    return this.repository.addProduct(cartid, product);
  }

  async removeProduct(cartid, product) {
    return this.repository.removeProduct(cartid, product);
  }
}

// binds base model to the kernel
Kernel.bind(Names.cart, ShoppingCartModel);

module.exports = ShoppingCartModel;
