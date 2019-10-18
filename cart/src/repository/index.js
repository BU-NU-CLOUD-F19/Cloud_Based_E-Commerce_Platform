'use strict';

const Kernel = require('./kernel');
const ProductsInCart = require('./products-in-cart/').ProductsInCartRepository;
const Cart = require('./cart/').CartRepository;

module.exports = {
  Kernel,
  ProductsInCart,
  Cart
}
