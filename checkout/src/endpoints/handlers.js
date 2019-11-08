/**
 * These are the handlers for the endpoints for the checkout service.
 * It's the code that actually contains the logic for each endpoint.
 */

'use strict';

const logger = require('../utils/logger');
const fetch = require('node-fetch');

// TODO: set from docker-compose.yml
const cartUrl = "http://cart:3000/cart"
const invUrl = "http://inventory-management:3020/inventory"

/**
 * The handler functions for all endpoints defined for the checkout service
 */
class Handlers {
  constructor() {
    this.logger = logger;
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
    const { data: { locked: cartLocked } } = await fetch(`${cartUrl}/${cartId}/lock`).then(res => res.json());
    if (cartLocked) {
      return rep.response("Cart is locked, perhaps a checkout is in progress.").code(400);
    }

    // Get cart data
    const cart = await fetch(`${cartUrl}/${cartId}`).then(res => res.json());
    this.logger.debug(`\tCart: ${Object.keys(cart)}`);

    // Add checkout time to cart
    // Lock the cart
    await fetch(`${cartUrl}/${cartId}/lock`, { method: 'PUT' });

    // doPayment()
    // if (not payment successful) {
    //  unlock cart
    //  remove checkout time
    //  respond with error
    // }
    // Subtract the products from the inventory
    for (let product of cart.data) {
      this.logger.debug(`Subtracting ${JSON.stringify(product)} from inventory`);
      // await fetch(`${invUrl}/subtract`, {
      //   method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      //   body: JSON.stringify(data) // body data type must match "Content-Type" header
      // })
    }

    // Create the order
    // Unlock the cart
    // Remove the cart
    //

    return rep.response("TODO").code(200);
  }

  async abortCheckout(req, rep) {
    return rep.response("TODO").code(200);
  }

  async finishCheckout(req, rep) {
    return rep.response("TODO").code(200);
  }

}

module.exports = Handlers;
