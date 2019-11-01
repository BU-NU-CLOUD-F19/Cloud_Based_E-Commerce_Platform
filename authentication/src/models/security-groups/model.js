'use strict';

const Kernel = require('../../repository/').Kernel;
const Names = require('../../constants/modelNames');

// The data repository (database)
const Repository = require('../../repository/').SecurityGroups;

/**
 * The model for the securityGroup acts as an interface between the routes/handlers and the database.
 * It contains all data logic pertaining to the shopping securityGroup.
 */
class SecurityGroupModel {
  constructor(options = {}) {
    this.resource = Names.securityGroups;
    this.repository = options.repository || (new Repository());
    this.logger = this.repository.logger;
  }

  /**
   * Delete all records that are related to this model
   * @async
   */
  async deleteAll() {
    return this.repository.deleteAll();
  }

  /**
   * Delete a securitygroup
   * @async
   * @param {number} securityGroupId - the id of the securityGroup
   */
  async deleteSecurityGroup(securityGroupId) {
    return this.repository.deleteSecurityGroup(securityGroupId);
  }

  /**
   * Create a securitygroup
   * @async
   * @param {number} scope - the scope of this securityGroup
   */
  async createSecurityGroup(scope) {
    return this.repository.createSecurityGroup(scope);
  }

  /**
   * Retrieve the securitygroup based on its scope
   * @async
   * @param {String} scope - the scope to be found
   */
  async getSecurityGroupByScope(scope) {
    return this.repository.getSecurityGroupByScope(scope);
  }

  /**
   * Retrieve all securitygroups
   * @async
   */
  async getSecurityGroups() {
    return this.repository.getSecurityGroups();
  }

}

// binds base model to the kernel
Kernel.bind(Names.securityGroups, SecurityGroupModel);

module.exports = SecurityGroupModel;
