/**
 * These are the handlers for the endpoints for the checkout service.
 * It's the code that actually contains the logic for each endpoint.
 */

'use strict';

const logger = require('../utils/logger');
const fetch = require('node-fetch');

const cartUrl = `http://${process.env.CART_HOST}:${process.env.CART_PORT}/cart`
const invUrl = `http://${process.env.INVENTORY_HOST}:${process.env.INVENTORY_PORT}/inventory`

const Orders = require('../models/').Orders;
/**
 * The handler functions for all endpoints defined for the checkout service
 */
class Handlers {
  constructor() {
    this.logger = logger;
    this.orders = new Orders();
  }

  /**
   * Check if properties are present in an object, returns an object with a boolean value.
   * When a property is missing, it also returns the missing property.
   * @static
   * @param {array} proplist - an array of properties that you want to check
   * @param {object} obj - the object to check
   */
  static propsPresent(proplist, obj) {
    for (let prop of proplist) {
      if (!(prop in obj)) {
        return {valid: false, missing: prop};
      }
    }
    return {valid: true};
  }

  async beginCheckout(req, rep) {
    const { id: cartId } = req.params;
    this.logger.debug(`Handler: begin checkout on cart ${cartId}`);

    // If cart is already locked, don't do anything
    let response = await fetch(`${cartUrl}/${cartId}/lock`);
    if (!response.ok) {
      let message = `Cannot get locked status of cart ${cartId}`;
      this.logger.debug(`\t${message}`);
      return this.abortCheckout({params: {id: cartId}}, rep, { reason: message, code: 500});
    }
    const { data: { locked: cartLocked } } = await response.json();
    if (cartLocked) {
      let message = "Cart is locked, perhaps a checkout is in progress.";
      this.logger.debug(`\t${message}`);
      return this.abortCheckout({params: {id: cartId}}, rep, { reason: message, code: 400 });
    }

    // Add checkout time to cart and lock it
    response = await fetch(`${cartUrl}/${cartId}/checkout`, { method: 'PUT' });
    if (!response.ok) {
      let message = `Cannot get locked status of cart ${cartId}`
      this.logger.debug(`\t${message}`);
      return this.abortCheckout({params: {id: cartId}}, rep, { reason: message, code: 500 });
    }

    let message ="Checkout initiated successfully.";
    this.logger.debug(`\t${message}`);
    return rep.response({ message }).code(200);
  }

  async doPayment() {
    return Promise.resolve(true);
  }
  calculatePrice(cart) {
    return { total: 42, shipping: 3.50 };
  }

  async buy(req, rep) {
    const { id: cartId } = req.params;
    this.logger.debug(`Handler: buy on cart ${cartId}`);

    // If cart is not locked, don't do anything
    let response = await fetch(`${cartUrl}/${cartId}/lock`);
    if (!response.ok) {
      let message = `Cannot get locked status of cart ${cartId}`;
      this.logger.debug(`\t${message}`);
      return this.abortCheckout({params: {id: cartId}}, rep, { reason: message, code: 500 });
    }
    const { data: { locked: cartLocked } } = await response.json();
    if (!cartLocked) {
      let message = "Cart is not locked, maybe a checkout wasn't started.";
      this.logger.debug(`\t${message}`);
      return this.abortCheckout({params: {id: cartId}}, rep, { reason: message, code: 400 });
    }

    // Get cart data
    response = await fetch(`${cartUrl}/${cartId}`)
    if (!response.ok) {
      let message = `Could not get contents of cart ${cartId}`;
      this.logger.debug(`\t${message}`);
      return this.abortCheckout({params: {id: cartId}}, rep, { reason: message, code: 500 });
    }
    const cart = await response.json();
    this.logger.debug(`\tGot cart: ${JSON.stringify(cart)}`);

    cart.cartId = cartId

    // Subtract the products from the inventory
    for (let product of cart.data) {
      this.logger.debug(`\tSubtracting ${JSON.stringify(product)} from inventory`);
      response = await fetch(`${invUrl}/${product.pid}/${product.amount_in_cart}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        let message = `Could not subtract ${product.amount_in_cart} of ${product.pid} from inventory.`;
        this.logger.debug(`\t${message}`);
        return this.abortCheckout({params: {id: cartId}}, rep, { reason: message, code: 500 });
      }
    }

    const price = this.calculatePrice(cart);
    const paymentSuccessful = await this.doPayment(price.total+price.shipping);
    this.logger.debug(JSON.stringify(paymentSuccessful));

    if (!paymentSuccessful) {
      // Re-add the products to the inventory
      for (let product of cart.data) {
        this.logger.debug(`Adding ${JSON.stringify(product)} to inventory`);
        response = await fetch(`${invUrl}/${product.pid}/${product.amount_in_cart}`, {
          method: 'PUT'
        })

        if (!response.ok) {
          let message = `Could not add ${product.amount_in_cart} of ${product.pid} to inventory.`;
          this.logger.debug(`\t${message}`);
          return this.abortCheckout({params: {id: cartId}}, rep, { reason: message, code: 500 });
        }
      }

      let message = "Payment unsuccessful";
      this.logger.debug(`\t${message}`);
      return this.abortCheckout({params: {id: cartId}}, rep, { reason: message, code: 402 });
    }
    else {
      this.logger.debug(`\tFinishing checkout...`);
      return this.finishCheckout(rep, cart, price);
    }
  }
  async abortCheckout(req, rep, why) {
    const { id: cartId } = req.params;
    const { reason, code } = why;
    this.logger.debug(`Handler: abort checkout on cart ${cartId}.`);
    if (reason) {
      this.logger.debug(`\tReason: ${reason} (code ${code})`);
    }

    // If cart not locked, don't do anything
    let response = await fetch(`${cartUrl}/${cartId}/lock`);
    if (!response.ok) {
      let message =`Cannot get locked status of cart ${cartId}`;
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(500);
    }
    const { data: { locked: cartLocked } } = await response.json();

    if (!cartLocked) {
      let message = "Cart is not locked, no checkout to abort.";
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(400);
    }

    response = await fetch(`${cartUrl}/${cartId}/checkout`, { method: 'DELETE' });
    if (!response.ok) {
      let message =`Could not abort checkout for cart ${cartId}`;
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(500);
    }

    if (reason) {
      let message = `Checkout aborted: ${reason}` ;
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(code);
    }
    else {
      let message = "Checkout aborted.";
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(200);
    }
  }

  async finishCheckout(rep, cart, price) {
    // If cart not locked, don't do anything
    const { cartId } = cart;
    let response = await fetch(`${cartUrl}/${cartId}/lock`);
    if (!response.ok) {
      let message = `Cannot get locked status of cart ${cartId}`
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(500);
    }
    const { data: { locked: cartLocked } } = await response.json();

    if (!cartLocked) {
      let message = "Cart is not locked, no checkout to abort."
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(400);
    }

    response = await fetch(`${cartUrl}/${cartId}/checkout`, { method: 'DELETE' });
    if (!response.ok) {
      let message = `Cannot finish checkout on cart ${cartId}`;
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(500);
    }

    response = await fetch(`${cartUrl}/${cartId}`, { method: 'DELETE' });
    if (!response.ok) {
      let message = `Cannot delete cart ${cartId}`;
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(500);
    }

    const order = await this.orders.createOrder({
      total_price: price.total,
      destination: "Easter Island",
      shipping: price.shipping,
      uid: 'user1' // TODO: shouldn't be hardcoded
    });

    this.logger.debug(`\tOrder created: ${JSON.stringify(order)}`);
    this.logger.debug(`Checkout complete`);

    return rep.response({ message: "Checkout complete", data: order }).code(201);
  }
}

module.exports = Handlers;
