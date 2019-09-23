'use strict';

const elv = require('elv');

const logger = require('../utils/logger');
const knex = require('./knex');

class PostgreSqlRepository {

  constructor(options = {}) {
    this.knex = options.knex;
    if (!this.knex) {
      const {
        connection,
        pool = { min: 2, max: 7 },
      } = options;
      this.knex = knex(connection, pool);
    }

    this.logger = elv.coalesce(options.logger, logger);
    this.resource = options.resource;
  }

  insert(id, data) {
    const value = {
      id,
      data,
    };
    const knexBuilder = this.knex(this.resource);
    return knexBuilder.insert(value).returning('*')
      .then((result) => {
        this.logger.info(`Successfully inserted 1 record into: ${this.resource}`);
        return result.data;
      })
      .catch((err) => {
        this.logger.error(err.message);
        throw err;
      });
  }

  findOne(id, options) {
    const knexBuilder = this.knex(this.resource);
    return knexBuilder.select('*').whereRaws('id', id)
      .then((result) => {
        this.logger.info(`Successfully inserted 1 record into: ${this.resource}`);
        return result.data;
      })
      .catch((err) => {
        this.logger.error(err.message);
        throw err;
      });
  }

}

module.exports = PostgreSqlRepository;

