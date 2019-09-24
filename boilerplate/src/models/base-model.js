/**
 * This class defines all the base methods for data/storage retrieval for a resource.
 */

'use strict';

const Kernel = require('./kernel');

class Model {
  constructor(options) {
    this.resource = options.resource; // the name of the resource inheriting this class
    this.repository = options.repository; // the repository of the resource inheriting this class
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
  // eslint-disable-next-line class-methods-use-this
  async findOneById(id) {
    return {
      data: id,
    };
    // uncomment this code when db is connected
    // return this.repository.findOneById(id)
    //   .then(entity => entity.data);
  }

}

// binds base model to the kernel
Kernel.bind('model', Model);

module.exports = Model;
