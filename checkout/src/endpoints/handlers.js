/**
 * These are the handlers for the endpoints for the checkout service.
 * It's the code that actually contains the logic for each endpoint.
 */

'use strict';

const logger = require('../utils/logger');
const fetch = require('node-fetch');
const { URL } = require('url');

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

  static addParams(url, params) {
    url = new URL(url);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return url;
  }

  async beginCheckout(req, rep) {
    const { id: cartId } = req.params;
    const authDetails = req.payload;

    this.logger.debug(`Handler: begin checkout on cart ${cartId}`);

    // If cart is already locked, don't do anything
    let response = await fetch(Handlers.addParams(`${cartUrl}/${cartId}/lock`, authDetails));
    if (!response.ok) {
      let message = `Cannot get locked status of cart ${cartId}`;
      this.logger.debug(`\t${message}`);
      return this.abortCheckout({params: {id: cartId}, body: authDetails}, rep, { reason: message, code: 500});
    }
    const { data: { locked: cartLocked } } = await response.json();
    if (cartLocked) {
      let message = "Cart is locked, perhaps a checkout is in progress.";
      this.logger.debug(`\t${message}`);
      return this.abortCheckout({params: {id: cartId}, body: authDetails}, rep, { reason: message, code: 400 });
    }

    // Add checkout time to cart and lock it
    response = await fetch(Handlers.addParams(`${cartUrl}/${cartId}/checkout`, authDetails), { method: 'PUT' });
    if (!response.ok) {
      let message = `Cannot get locked status of cart ${cartId}`
      this.logger.debug(`\t${message}`);
      return this.abortCheckout({params: {id: cartId}, body: authDetails}, rep, { reason: message, code: 500 });
    }

    let message ="Checkout initiated successfully.";
    this.logger.debug(`\t${message}`);
    return rep.response({ message }).code(200);
  }

  async doPayment() {
    this.logger.debug("\tPayment sucessful");
    return Promise.resolve(true);
  }

  static calculateShippingPrice(shippingAddress, productCost, shippingProvider, daysToDeliver) {
    return 42;
  }

  async calculatePrice(cart, rep, authDetails) {
    this.logger.debug("\tCalculating price");
    let price = 0;
    for (let product of cart.data) {
      let response = await fetch(`${invUrl}/${product.pid}`);
      if (!response.ok) {
        let message = `Cannot fetch information for ${product.pid}`;
        this.logger.debug(`\t${message}`);
        return this.abortCheckout({params: {id: cart.id}, body: authDetails}, rep, { reason: message, code: 500 });
      }

      let unitPrice = await response.json();
      price += Number(unitPrice)*Number(product.amount_in_cart);
    }

    return { total: price, shipping: Handlers.calculateShippingPrice() };
  }

  async buy(req, rep) {
    const { id: cartId } = req.params;
    const authDetails = req.payload;
    this.logger.debug(`Handler: buy on cart ${cartId}`);

    // If cart is not locked, don't do anything
    let response = await fetch(Handlers.addParams(`${cartUrl}/${cartId}/lock`, authDetails));
    if (!response.ok) {
      let message = `Cannot get locked status of cart ${cartId}`;
      this.logger.debug(`\t${message}`);
      return this.abortCheckout({params: {id: cartId}, body: authDetails}, rep, { reason: message, code: 500 });
    }
    const { data: { locked: cartLocked } } = await response.json();
    if (!cartLocked) {
      let message = "Cart is not locked, maybe a checkout wasn't started.";
      this.logger.debug(`\t${message}`);
      return this.abortCheckout({params: {id: cartId}, body: authDetails}, rep, { reason: message, code: 400 });
    }

    // Get cart data
    response = await fetch(Handlers.addParams(`${cartUrl}/${cartId}`, authDetails))
    if (!response.ok) {
      let message = `Could not get contents of cart ${cartId}`;
      this.logger.debug(`\t${message}`);
      return this.abortCheckout({params: {id: cartId}, body: authDetails}, rep, { reason: message, code: 500 });
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
        let message = `Could not subtract ${product.amount_in_cart} of product id ${product.pid} from inventory.`;
        this.logger.debug(`\t${message}`);
        return this.abortCheckout({params: {id: cartId}, body: authDetails}, rep, { reason: message, code: 400 });
      }
    }

    const price = await this.calculatePrice(cart, rep, authDetails);
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
          return this.abortCheckout({params: {id: cartId}, body: authDetails}, rep, { reason: message, code: 500 });
        }
      }

      let message = "Payment unsuccessful";
      this.logger.debug(`\t${message}`);
      return this.abortCheckout({params: {id: cartId}, body: authDetails}, rep, { reason: message, code: 402 });
    }
    else {
      this.logger.debug(`\tFinishing checkout...`);
      return this.finishCheckout(rep, cart, price, authDetails);
    }
  }
  async abortCheckout(req, rep, why) {
    const { id: cartId } = req.params;
    const { authDetails } = req.payload;
    this.logger.debug(`Handler: abort checkout on cart ${cartId}.`);

    // If cart not locked, don't do anything
    let response = await fetch(Handlers.addParams(`${cartUrl}/${cartId}/lock`, authDetails));
    if (!response.ok) {
      let message =`Cannot get locked status of cart ${cartId}`;
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(500);
    }
    const { data: { locked: cartLocked } } = await response.json();

    if (!cartLocked) {
      let message = "Cart is not locked, no checkout in progress.";
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(400);
    }

    response = await fetch(Handlers.addParams(`${cartUrl}/${cartId}/checkout`, authDetails), { method: 'DELETE' });
    if (!response.ok) {
      let message =`Could not abort checkout for cart ${cartId}`;
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(500);
    }

    if (why) {
      const { reason, code } = why;
      if (reason) {
        this.logger.debug(`\tAborting because: ${reason} (code ${code})`);
        return rep.response({ message: `Checkout aborted: ${reason}` }).code(code);
      }
    }

    else {
      let message = "Checkout aborted.";
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(200);
    }
  }

  async finishCheckout(rep, cart, price, authDetails) {
    // If cart not locked, don't do anything
    const { cartId } = cart;
    let response = await fetch(Handlers.addParams(`${cartUrl}/${cartId}/lock`, authDetails));
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

    response = await fetch(Handlers.addParams(`${cartUrl}/${cartId}/checkout`, authDetails), { method: 'DELETE' });
    if (!response.ok) {
      let message = `Cannot finish checkout on cart ${cartId}`;
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(500);
    }

    response = await fetch(Handlers.addParams(`${cartUrl}/${cartId}`, authDetails), { method: 'DELETE' });
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
