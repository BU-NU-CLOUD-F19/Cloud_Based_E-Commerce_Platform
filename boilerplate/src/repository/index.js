/**
 * This is the repository class which talks to the database for all
 * the storage and retrieval functions
 */

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

  /**
   * Inserts a record into the database
   * @param  {String} id of the database to be inserted
   * @param  {Object} data of the record to be inserted
   */
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

  /**
   * Finds a db record base on the id
   * @param  {String} id of the record to be found
   * @returns the retrieved record
   */
  findOneById(id) {
    const knexBuilder = this.knex(this.resource);
    return knexBuilder.select('*').whereRaws('id', id)
      .then((result) => {
        this.logger.info(`Successfully found 1 record into: ${this.resource}`);
        return result;
      })
      .catch((err) => {
        this.logger.error(err.message);
        throw err;
      });
  }

}

module.exports = PostgreSqlRepository;
