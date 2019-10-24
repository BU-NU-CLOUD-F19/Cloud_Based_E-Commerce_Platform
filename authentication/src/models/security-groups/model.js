'use strict';

const Kernel = require('../../repository/').Kernel;
const Names = require('../../constants/modelNames');

// The data repository (database)
const Repository = require('../../repository/').SecurityGroups;

/**
 * The model for the shopping cart acts as an interface between the routes/handlers and the database.
 * It contains all data logic pertaining to the shopping cart.
 */
class SecurityGroupModel {
  constructor(options = {}) {
    this.resource = Names.securityGroups;
    this.repository = options.repository || (new Repository());
    this.logger = this.repository.logger;
  }

  /**
   * Delete all records that are related to this model (carts, products_in_cart).
   * @async
   */
  async deleteAll() {
    return this.repository.deleteAll();
  }

  /**
   * Delete a securitygroup
   * @async
   * @param {number} securityGroupId - the id associated with a cart
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
   * @param {number} scope - the scope to be found
   */
  async getSecurityGroup(scope) {
    return this.repository.getSecurityGroup(scope);
  }

}

// binds base model to the kernel
Kernel.bind(Names.cart, SecurityGroupModel);

module.exports = SecurityGroupModel;
