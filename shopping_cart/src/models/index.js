/**
 * This class exports all the models defined in the models folder
 */

'use strict';

const Kernel = require('./kernel');

// shopping_cart
const shopping_cart = require('./shopping_cart');

module.exports = {
  shopping_cart,
  Kernel,
};
