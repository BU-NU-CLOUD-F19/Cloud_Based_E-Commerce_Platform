'use strict';

const _ = require('lodash');
const elv = require('elv');

const emptyLogger = require('./empty-logger');
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

    this.logger = elv.coalesce(options.logger, emptyLogger);
    this.resource = options.resource;
  }

  insert(context, id, data) {
    PostgreSqlRepository._assertContext(context);
    PostgreSqlRepository._assertId(id);

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
      });
  }

  findOne(context, id, transaction, options) {
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
        throw translate(err, false);
      });
  }

}

module.exports = PostgreSqlRepository;

