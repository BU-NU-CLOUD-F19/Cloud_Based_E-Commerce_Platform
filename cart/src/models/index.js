/**
 * This class exports all the models defined in the models folder
 */

'use strict';

// cart
const Cart = require('./cart/').Model;
const ProductsInCart = require('./products-in-cart/').Model;

module.exports = {
  Cart,
  ProductsInCart
};
