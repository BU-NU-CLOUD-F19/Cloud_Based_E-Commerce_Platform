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

  deleteAll() {
    return this.repository.deleteAll().then(entity => { return entity });
  }

  getProducts(cartid) {
    return this.repository.getProducts(cartid).then(entity => { return entity });
  }

  addProduct(cartid, product) {
    return this.repository.addProduct(cartid, product).then(entity => { return entity });
  }
}

// binds base model to the kernel
Kernel.bind(Names.cart, ShoppingCartModel);

module.exports = ShoppingCartModel;
