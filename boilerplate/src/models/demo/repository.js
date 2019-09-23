'use strict';

const PostgreSqlRepository = require('../../repository');

const logger = require('../../utils/logger');
const Names = require('../../configs/classNames');
const Kernel = require('../kernel');

const resource = Names.demo;

class DemoRepository extends PostgreSqlRepository {
  constructor() {
    const knexManager = Kernel.resolve(Names.knexManager);

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
