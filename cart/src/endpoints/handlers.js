/**
 * These are the handlers for the endpoints for the cart.
 * It's the code that actually contains the logic for each endpoint.
 */

'use strict';

const logger = require('../utils/logger');
const ProductsInCart = require('../models/').ProductsInCart;
const Carts = require('../models/').Cart;
const shortid = require('shortid');

/**
 * The handler functions for all endpoints defined for the cart
 */
class Handlers {
  constructor() {
    this.productsInCart = new ProductsInCart();
    this.carts = new Carts();
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

  async isAuthorized({ uid, sid, password }, cartId) {
    let as;
    if (uid) {
      if (!password) {
        return { authorized: false, why: "Password not provided" }
      }
      else {
        // TODO: verify uid-pass paid with auth
        uid = uid;
        as = 'reguser';
      }
    }
    else if (sid) {
      uid = sid; // already existing guest
      as = 'guest';
    }
    else {
      // TODO: contact auth for new guest id
      uid = shortid.generate(); // new guest session
      as = 'guest';
    }

    const cart = (await this.carts.getCart(cartId))[0];
    if (!cart) {
      return { authorized: true, uid, as }
    }
    else if (uid != cart.uid || uid != cart.sid) {
      return { authorized: false, why: `Cannot modify cart ${id} as user ${uid}.` }
    }
    else {
      return { authorized: true, uid, as }
    }
  }

  /**
   * Add a product to a cart.
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async addProduct(req, rep) {
    this.logger.logRequest(req);
    const { params: { id }, payload } = req;

    // Check if request contains a body
    if (!payload) {
      let message = "Body cannot be empty.";
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(400);
    }

    // Check if request body contains the required values
    const isValid = Handlers.propsPresent(['pid', 'amount_in_cart'], payload);
    if (!isValid.valid) {
      return rep.response({message: `${isValid.missing} not specified.`}).code(400);
    }

    this.logger.debug(`\tChecking authorization...`);
    const auth = await this.isAuthorized(payload, id);
    if (!auth.authorized) {
      this.logger.debug(`\t${auth.why}`);
      return rep.response({ message: auth.why }).code(403);
    }

    this.logger.debug(`\tHandler: Adding product ${JSON.stringify(payload)} to cart ${id}`);

    try {
      // Add the product to the cart
      if (await this.carts.getCart(id) == 0) {
        if (auth.as === 'guest') {
          await this.carts.createCart(id, { sid: auth.uid });
        }
        else if (auth.as == 'reguser') {
          await this.carts.createCart(id, { uid: auth.uid });
        }
      }

      // Abort if the cart is locked
      if (await this.carts.isLocked(id)) {
        return rep.response({message: "Cart is locked, perhaps a checkout is in progress."}).code(403);
      }

      const res = await this.productsInCart.addProduct(id, payload);
      this.logger.debug(`\tResult: ${JSON.stringify(res)}`);


      await this.carts.modified(id);

      // Return what was added
      return rep.response({message: "Product added to cart.", data: res}).code(201);
    }

    // Catch any database errors (e.g. product not found) and return the appropriate response
    catch (err) {
      if (err.constraint === "products_in_cart_pid_fkey") {
        let message = 'Product does not exist.';

        this.logger.debug(`\t${message} -- ${err.detail}`);
        return rep.response({message: message}).code(400);
      }
      else if (err.constraint === "carts_uid_fkey") {
        let message = 'User does not exist.';
        this.logger.debug(`\t${message} -- ${err.detail}`);
        return rep.response({message: message}).code(400);
      }
      else if (err.constraint === "products_in_cart_pkey") {
        let message = 'Product already present in cart.';
        this.logger.debug(`\t${message} -- ${err.detail}`);
        return rep.response({message: message}).code(400);
      }
      else if (err.what == "cart_does_not_exist") {
        this.logger.error(`${err.message}`);
        return rep.response(`${err.message}`).code(400);
      }
      else {
        this.logger.error(`Handler: ${JSON.stringify(err)}`);
        throw err;
      }
    }
  }

  /**
   * Remove a product from a cart
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async removeProduct(req, rep) {
    this.logger.logRequest(req);
    const { params: { id }, payload } = req;

    // Check if request contains a body
    if (!payload) {
      let message = "Body cannot be empty.";
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(400);
    }

    // Check if request body contains the required values
    const isValid = Handlers.propsPresent(['pid'], payload);
    if (!isValid.valid) {
      return rep.response({message: `${isValid.missing} not specified.`}).code(400);
    }

    this.logger.debug(`\tChecking authorization...`);
    const auth = await this.isAuthorized(payload, id);
    if (!auth.authorized) {
      this.logger.debug(`\t${auth.why}`);
      return rep.response({ message: auth.why }).code(403);
    }

    this.logger.debug(`\tHandler: Removing product ${JSON.stringify(payload)} from cart ${id}`);

    try {
      // Abort if the cart is locked
      if (await this.carts.isLocked(id)) {
        return rep.response({message: "Cart is locked, perhaps a checkout is in progress."}).code(403);
      }

      const res = await this.productsInCart.removeProduct(id, payload);
      this.logger.debug(`\tResult: ${JSON.stringify(res)}`);

      // If no rows were removed (i.e. the products wasn't in cart), respond with a 400.
      if (res === 0) {
        return rep.response({message: `Product ${payload.pid} not in cart ${id}.`}).code(400);
      }
      else {
        // Otherwise, return  how many rows were removed
        await this.carts.modified(id);

        return rep.response({message: "Product removed from cart.", data: res}).code(200);
      }
    }
    catch (err) {
      if (err.what == "cart_does_not_exist") {
        this.logger.error(`${err.message}`);
        return rep.response(`${err.message}`).code(400);
      }
      this.logger.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Change the amount of a product in a cart.
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async changeAmount(req, rep) {
    this.logger.logRequest(req);
    const { params: { id }, payload } = req;

    // TODO: Should we deal with product not in stock?

    // Check if request contains a body
    if (!payload) {
      let message = "Body cannot be empty.";
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(400);
    }

    // Check if request body contains the required values
    const isValid = Handlers.propsPresent(['pid', 'amount_in_cart'], payload);
    if (!isValid.valid) {
      return rep.response({message: `${isValid.missing} not specified.`}).code(400);
    }

    // Check if the new amount is valid
    if (payload.amount_in_cart <= 0) {
      return rep.response({message: "Amount must be greater than 0."}).code(400);
    }

    this.logger.debug(`\tChecking authorization...`);
    const auth = await this.isAuthorized(payload, id);
    if (!auth.authorized) {
      this.logger.debug(`\t${auth.why}`);
      return rep.response({ message: auth.why }).code(403);
    }

    this.logger.debug(`\tHandler: Changing amount of product in cart ${id}`);

    try {
      // Abort if the cart is locked
      if (await this.carts.isLocked(id)) {
        return rep.response({message: "Cart is locked, perhaps a checkout is in progress."}).code(403);
      }

      // Change the amount in the cart
      const res = await this.productsInCart.changeAmount(id, payload);

      // Return the new product record
      if (res.length > 0) {
        await this.carts.modified(id);
        return rep.response({message: "Amount updated.", data: res});
      }
      // If nothing was updated, the product wasn't in the cart.
      else {
        return rep.response({message: "No such product in cart."}).code(400);
      }
    }
    // Catch database errors
    catch(err) {
      if (err.constraint === "products_in_cart_pid_fkey") {
        let message = 'Product does not exist.';
        this.logger.debug(`\t${message} -- ${err.detail}`);
        return rep.response({message: message}).code(400);
      }
      else {
        this.logger.error(JSON.stringify(err));
      }
    }

  }

  /**
   * Empty the cart (remove all products)
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async emptyCart(req, rep) {
    this.logger.logRequest(req);
    const { params: { id }, payload } = req;

    // Check if request contains a body
    if (!payload) {
      let message = "Body cannot be empty.";
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(400);
    }

    this.logger.debug(`\tChecking authorization...`);
    const auth = await this.isAuthorized(payload, id);
    if (!auth.authorized) {
      this.logger.debug(`\t${auth.why}`);
      return rep.response({ message: auth.why }).code(403);
    }

    // If cart does not exist, error
    this.logger.debug(`\tHandler: Emptying cart ${id}`);

    try {
      // Empty the cart
      if (await this.carts.getCart(id) === 0) {
        return rep.response({message: "Cart does not exist."}).code(400);
      }

      // Abort if the cart is locked
      if (await this.carts.isLocked(id)) {
        return rep.response({message: "Cart is locked, perhaps a checkout is in progress."}).code(403);
      }

      const res = await this.productsInCart.emptyCart(id);

      // Return the number of products removed
      await this.carts.modified(id);
      return rep.response({message: "Cart emptied.", data: res}).code(200);
    }
    catch(err) {
      if (err.what == "cart_does_not_exist") {
        this.logger.error(`${err.message}`);
        return rep.response(`${err.message}`).code(400);
      }
      this.logger.error(JSON.stringify(err));
    }
  }

  /**
   * Remove the cart including all products
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async deleteCart(req, rep) {
    const { params: { id }, payload } = req;
    this.logger.logRequest(req);

    // Check if request contains a body
    if (!payload) {
      let message = "Body cannot be empty.";
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(400);
    }

    this.logger.debug(`\tChecking authorization...`);
    const auth = await this.isAuthorized(payload, id);
    if (!auth.authorized) {
      this.logger.debug(`\t${auth.why}`);
      return rep.response({ message: auth.why }).code(403);
    }

    this.logger.debug(`\tHandler: Removing cart ${id}`);

    try {
      // Abort if the cart is locked
      if (await this.carts.isLocked(id)) {
        return rep.response({message: "Cart is locked, perhaps a checkout is in progress."}).code(403);
      }

      // Empty the cart
      await this.productsInCart.emptyCart(id);

      // Delete the cart
      const res = await this.carts.deleteCart(id);

      // If something has been deleted, return the number of carts deleted (should always be 1)
      if (res === 1) {
        return rep.response({message: "Cart deleted.", data: res})
      }
      // If nothing was deleted, cart doesn't exist
      else if (res === 0) {
        return rep.response({message: "Cart does not exist"}).code(400);
      }
      // You should never delete more than one cart
      else {
        this.logger.error(`Deleted more than one cart, this shouldn't happen: ${res}`);
      }
    }
    catch(err) {
      if (err.what == "cart_does_not_exist") {
        this.logger.error(`${err.message}`);
        return rep.response(`${err.message}`).code(400);
      }
      this.logger.error(JSON.stringify(err));
    }
  }

  /**
   * List the products in a cart
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async getProducts(req, rep) {
    const { params: { id }, payload } = req;
    this.logger.logRequest(req);

    // Check if request contains a body
    if (!payload) {
      let message = "Body cannot be empty.";
      this.logger.debug(`\t${message}`);
      return rep.response({ message }).code(400);
    }

    this.logger.debug(`\tChecking authorization...`);
    const auth = await this.isAuthorized(payload, id);
    if (!auth.authorized) {
      this.logger.debug(`\t${auth.why}`);
      return rep.response({ message: auth.why }).code(403);
    }

    try {
      this.logger.debug(`\tHandler: Listing all products in ${id}`);

      // Get the products in the cart and return them
      const result = await this.productsInCart.getProducts(id);
      return rep.response({message: "Products retrieved.", data: result}).code(200);
    }
    catch(err)  {
      this.logger.error(err.message);
    }
  }

  async lockCart(req, rep) {
    const { id } = req.params;
    this.logger.logRequest(req);

    this.logger.debug(`\tChecking authorization...`);
    const auth = await this.isAuthorized(payload, id);
    if (!auth.authorized) {
      this.logger.debug(`\t${auth.why}`);
      return rep.response({ message: auth.why }).code(403);
    }

    try {
      this.logger.debug(`\tHandler: Locking cart ${id}`);

      await this.carts.lockCart(id);

      await this.carts.modified(id);
      return rep.response({message: "Cart locked."}).code(200);
    }
    catch(err) {
      this.logger.error(err.message);
    }
  }

  async unlockCart(req, rep) {
    const { id } = req.params;
    this.logger.logRequest(req);

    this.logger.debug(`\tChecking authorization...`);
    const auth = await this.isAuthorized(payload, id);
    if (!auth.authorized) {
      this.logger.debug(`\t${auth.why}`);
      return rep.response({ message: auth.why }).code(403);
    }

    try {
      this.logger.debug(`\tHandler: Unlocking cart ${id}`);

      await this.carts.unlockCart(id);
      await this.carts.modified(id);
      return rep.response({message: "Cart unlocked."}).code(200);
    }
    catch(err) {
      this.logger.error(err.message);
    }

  }

  async isLocked(req, rep) {
    const { id } = req.params;
    this.logger.logRequest(req);

    this.logger.debug(`\tChecking authorization...`);
    const auth = await this.isAuthorized(payload, id);
    if (!auth.authorized) {
      this.logger.debug(`\t${auth.why}`);
      return rep.response({ message: auth.why }).code(403);
    }

    try {
      this.logger.debug(`\tHandler: getting locked status of ${id}`);

      const result = await this.carts.isLocked(id);

      return rep.response({message: "Cart status retrieved.", data: { locked: result }}).code(200);

    }
    catch(err) {
      if (err.what == "cart_does_not_exist") {
        this.logger.error(`${err.message}`);
        return rep.response(`${err.message}`).code(400);
      }
      this.logger.error(err.message);
    }

  }

  /**
   * Start the checkout for a cart (lock and update its begin checkout field to the current time)
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async startCheckout(req, rep) {
    const { id } = req.params;

    this.logger.debug(`\tChecking authorization...`);
    const auth = await this.isAuthorized(payload, id);
    if (!auth.authorized) {
      this.logger.debug(`\t${auth.why}`);
      return rep.response({ message: auth.why }).code(403);
    }

    try {
      // If the cart is locked, do nothing
      if (await this.carts.isLocked(id)) {
        return rep.response({message: "Cart is locked."}).code(403);
      }

      await this.carts.beginCheckout(id);

      return rep.response({message: "Checkout started."}).code(200);
    }

    catch (err) {
      if (err.what == "cart_does_not_exist") {
        this.logger.error(`${err.message}`);
        return rep.response(`${err.message}`).code(400);
      }
      this.logger.error(JSON.stringify(err));
    }
  }


  /**
   * End the checkout for a cart (unlock and clear its checkout time field)
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async endCheckout(req, rep) {
    const { id } = req.params;

    this.logger.debug(`\tChecking authorization...`);
    const auth = await this.isAuthorized(payload, id);
    if (!auth.authorized) {
      this.logger.debug(`\t${auth.why}`);
      return rep.response({ message: auth.why }).code(403);
    }


    try {
      if (!(await this.carts.isLocked(id))) {
        return rep.response({message: "No checkout in progress."}).code(400);
      }

      await this.carts.endCheckout(id);

      return rep.response({message: "Checkout finished."}).code(200);
    }

    catch (err) {
      if (err.what == "cart_does_not_exist") {
        this.logger.error(`${err.message}`);
        return rep.response(`${err.message}`).code(400);
      }
      this.logger.error(JSON.stringify(err));
    }
  }
}

module.exports = Handlers;
