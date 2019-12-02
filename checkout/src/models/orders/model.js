'use strict';

const Kernel = require('../../repository/').Kernel;
const Names = require('../../constants/modelNames');

// The data repository (database)
const Repository = require('../../repository/').Orders;

/**
 * The model for the checkout service acts as an interface between the routes/handlers and the database.
 * It contains all data logic pertaining to the checkout process.
 */
class OrdersModel {
  constructor(options = {}) {
    this.resource = Names.orders;
    this.repository = options.repository || (new Repository());
    this.logger = this.repository.logger;
  }

  async createOrder(details) {
    return this.repository.createOrder(details);
  }

}

// binds base model to the kernel
Kernel.bind(Names.orders, OrdersModel);

module.exports = OrdersModel;
