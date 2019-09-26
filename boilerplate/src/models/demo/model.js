/**
 * This class defines business logic to process the request for `demo` resource.
 */

'use strict';

const elv = require('elv');

const Kernel = require('../kernel');
const Names = require('../../constants/modelNames');
const Repository = require('./repository');
const Model = require('../base-model');

class DemoModel extends Model {
  constructor(options) {
    const ops = elv.coalesce(options, {});

    super({
      resource: Names.demo,
      repository: elv.coalesce(ops.repository, () => new Repository()),
    });
  }

  /**
   * Inserts a `demo` record into the database
   *
   * @param  {Object} value the value to be inserted
   */
  insert(value) {
    return super.insert(value);
  }

  /**
   * Retrieves a `demo` record from database by its id
   * @param  {String} id the id by which the record should be fetched
   */
  findOneById(id) {
    return super.findOneById(id);
  }
}

// binds the instance to Kernel for singularity
Kernel.bind(Names.demo, DemoModel);

module.exports = DemoModel;
