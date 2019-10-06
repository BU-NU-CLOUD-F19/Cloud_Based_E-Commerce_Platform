/**
 * This class defines business logic to process the request for `cart` resource.
 */

'use strict';

const Kernel = require('../kernel');
const Names = require('../../constants/modelNames');

// The data repository (database)
const Repository = require('./repository');

const BaseModel = require('../base-model');

class ShoppingCartModel extends BaseModel {
  constructor(options = {}) {
    const repo = options.repository || (new Repository());

    super({
      resource: Names.cart,
      repository: repo,
    });
  }

  /**
   * Inserts a `cart` record into the database
   *
   * @param  {Object} value the value to be inserted
   */
  insert(value) {
    return super.insert(value);
  }

  /**
   * Retrieves a `cart` record from database by its id
   * @param  {String} id the id by which the record should be fetched
   */
  findOneById(id) {
    return super.findOneById(id);
  }
}

// binds the instance to Kernel for singularity
Kernel.bind(Names.cart, ShoppingCartModel);

module.exports = ShoppingCartModel;
