'use strict';

const Kernel = require('../../repository/').Kernel;
const Names = require('../../constants/modelNames');

// The data repository (database)
const Repository = require('../../repository/').Checkout;

/**
 * The model for the checkout service acts as an interface between the routes/handlers and the database.
 * It contains all data logic pertaining to the checkout process.
 */
class CheckoutModel {
  constructor(options = {}) {
    this.resource = Names.checkout;
    this.repository = options.repository || (new Repository());
    this.logger = this.repository.logger;
  }

}

// binds base model to the kernel
Kernel.bind(Names.checkout, CheckoutModel);

module.exports = CheckoutModel;
