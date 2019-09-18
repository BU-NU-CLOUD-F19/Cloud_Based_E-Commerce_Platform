'use strict';

const elv = require('elv');
const _ = require('lodash');
const { Clause, Filter } = require('spleen');
const Promise = require('bluebird');

const Kernel = require('../../../kernel');
const Names = require('../../../classNames');
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

  insert(value) {
    return super.insert(value);
  }

  findOne(id) {
    return super.patch(id);
  }
}

Kernel.bind(Names.demo, DemoModel);
module.exports = DemoModel;
