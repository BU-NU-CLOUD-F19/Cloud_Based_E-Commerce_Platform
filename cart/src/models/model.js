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
  }

  /**
   * Insert a record into the db
   * @param  {Object} value the value to be inserted
   * @returns the inserted record
   */
  insert(value) {
    return this.repository.insert(value)
      .then(result => result.value);
  }

  /**
   * Find a record by its id
    * @param  {String} id the id by which the record needs to be found
   */
  async findOneById(id) {
    // uncomment this code when db is connected
    return this.repository.findOneById(id)
      .then(entity => {
        // you can add some post-querying logic here
        return entity;
      });
  }

}

// binds base model to the kernel
Kernel.bind(Names.cart, ShoppingCartModel);

module.exports = ShoppingCartModel;
