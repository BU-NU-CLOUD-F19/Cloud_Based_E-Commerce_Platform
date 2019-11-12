/**
 * This class defines all the methods to handle calls to db for `security-groups` resource,
 * using query-builder tool
 */

'use strict';

const logger = require('../../utils/logger');
const Names = require('../../constants/modelNames');
const resource = Names.securityGroups;
const Kernel = require('../kernel');
const knex = require('../knex');
const shortid = require('shortid');

/**
 * Defines primitive functions for interacting with the PostgreSQL database.
 * They only retrieve and return data, they do not contain any data logic -- that is the responsibility of the model.
 */
class SecurityGroupRepository {
  constructor(options = {}) {
    const knexManager = Kernel.resolve(Names.knexManager);

    this.knex = knexManager.knex;
    if (!this.knex) {
      const {
        connection,
        pool = { min: 2, max: 7 },
      } = options;
      this.knex = knex(connection, pool);
    }

    this.logger = logger;
    this.resource = resource;
  }

  /**
   * Inserts the current date and time into Postgres by generating a string that calls a Postgres function.
   */
  postgresDateStr() {
    // Need to use knex.raw() to call Postgres functions
    // Date.now() returns milliseconds, while Postgres to_timestamp() accepts seconds, so need to divide.
    return this.knex.raw(`to_timestamp(${Date.now()} / 1000.0)`);
  }


  /**
   * Delete all security-groupss
   * @async
   */
  async deleteAll() {
    try {
      // Knex doesn't provide a way to cascade, so have to use a raw query
      const query = this.knex.raw(`TRUNCATE TABLE ${this.resource} CASCADE`);
      const result = await query;

      this.logger.debug("Successfully truncated the table.");
      return result;
    }
    catch (err) {
      this.logger.error(err.message);
    }
  }

  /**
   * Get all security-groups
   * @async
   */
  async getSecurityGroups() {
    const securityGroups = this.knex(this.resource);
    const query = securityGroups.select('*');
    this.logger.debug(`\tQuery: ${query}`);

    const listSecurityGroups = await query;
    this.logger.debug(`\tResult ${JSON.stringify(listSecurityGroups)}`);
    return listSecurityGroups;
  }


  /**
   * Get the security group by its scope
   * @async
   * @param {string} scope - the id associated with a security-groups
   */
  async getSecurityGroupByScope(scope) {
    const securityGroups = this.knex(this.resource);
    const query = securityGroups.select('*').where({scope});
    this.logger.debug(`\tQuery: ${query}`);

    const listSecurityGroups = await query;
    this.logger.debug(`\tResult ${JSON.stringify(listSecurityGroups)}`);
    return listSecurityGroups;
  }

  /**
   * Create a new security group
   * @async
   * @param {String} scope - scope of this security group
   */
  async createSecurityGroup(scope) {

    // TODO: add a check that only four scopes are created
    // SUPER_ADMIN, STORE_ADMIN, CUSTOMER, GUEST
    const securityGroups = this.knex(this.resource);

    const securityGroupData = {
      id: shortid.generate(),
      scope,
      date_created: this.postgresDateStr()
    };

    const query = securityGroups.insert(securityGroupData).returning('*');
    this.logger.debug(`\tQuery: ${query}`);

    const created = await query;
    this.logger.debug(`\tResult: ${created}`);
    return created;
  }

  /**
   * Delete a security group
   * @async
   * @param {number} id - the id associated with a security group
   */
  async deleteSecurityGroup(id) {
    const securityGroups = this.knex(this.resource);
    const query = securityGroups.where({id}).del();
    this.logger.debug(`\tQuery: ${query}`);

    const removed = await query;
    this.logger.debug(`\tResult: ${removed}`);
    return removed;
  }
}

module.exports = SecurityGroupRepository;
