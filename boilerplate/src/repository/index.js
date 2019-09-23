'use strict';


const _ = require('lodash');
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
    const data = JSON.stringify(value.data);
    const knex = this.knex(this.resource);
    return knex.insert(value).returning('*')
      .then((result) => {
        this.logger.info(`Successfully inserted 1 record into: ${this.resource}`);
        return result.data;
      })
      .catch((err) => {
        this.logger.error(err.message);
        throw err;
      });
  }

  findOne(id, transaction, options) {
    PostgreSqlRepository._assertContext(context);
    PostgreSqlRepository._assertId(id);

    const query = this._query(transaction, options)
      .where({ id });

    const builder = query.first();
    this.logSql(builder);
    return builder
      .then((result) => {
        if (!result) {
          throw new Error('NotFoundError: Request', { id, resource: this.resource });
        }
        return result.data;
      })
      .catch((err) => {
        this.logger.error(err.message);
        throw err;
      });
  }

}

module.exports = PostgreSqlRepository;

