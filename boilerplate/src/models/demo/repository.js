/**
 * This class defines all the methods to handle calls to db for `demo` resource,
 * using query-builder tool
 */

'use strict';

const PostgreSqlRepository = require('../../repository');

const logger = require('../../utils/logger');
const Names = require('../../constants/modelNames');
const Kernel = require('../kernel');

const resource = Names.demo;

class DemoRepository extends PostgreSqlRepository {
  constructor() {
    const knexManager = Kernel.resolve(Names.knexManager); // pick the already defined knex-instance

    super({
      name: Names.demo,
      resource,
      knex: knexManager.knex,
      logger,
      identifier: `${resource}.data`,
    });
  }
}

module.exports = DemoRepository;
