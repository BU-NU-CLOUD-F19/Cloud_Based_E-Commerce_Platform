/**
 * This file should be extended by all the request handlers implemented.
 * It is the base class that contains the request handling logic for
 * GET POST, PUT, PATCH, DELETE requests for the resources
 */

'use strict';

const logger = require('../utils/logger');
const Model = require('../models').Model;

class Handlers {
  constructor(model) {
    this.model = model || (new Model());
  }

  // eslint-disable-next-line class-methods-use-this
  addProduct(req, rep) {
    // If cart exists, add.
    // Else, create a new cart and add, incl amount.
    if (!req.payload) {
      return rep.response("Body cannot be empty.").code(400);
    }

    logger.debug(`Adding product ${req.payload} to cart ${req.params.id}`);

    // TODO: addProduct data logic
    return rep.response("TODO: product should be added.").code(201);
  }

  // eslint-disable-next-line class-methods-use-this
  removeProduct(req, rep) {
    // If cart does not exist, error.
    // If product not in cart, error.
    // Else, remove the product.

    if (!req.payload) {
      return rep.response("Body cannot be empty.").code(400);
    }

    logger.debug(`Removing product ${req.payload} from cart ${req.params.id}`);
    // TODO: removeProduct data logic
    return rep.response("TODO: product should be removed.").code(200);
  }

  // eslint-disable-next-line class-methods-use-this
  changeAmount(req, rep) {
    // If product not in cart, error.
    // If cart does not exist, error.
    // Should we deal with product not in stock?

    if (!req.payload) {
      return rep.response("Body cannot be empty.").code(400);
    }

    logger.debug(`Changing amount of product in cart ${req.params.id}`);
    // TODO: changeAmount data logic
    return rep.response("TODO: amount should be changed");
  }

  // eslint-disable-next-line class-methods-use-this
  emptyCart(req, rep) {
    // If cart does not exist, error
    logger.debug(`Emptying cart ${req.params.id}`);
    // TODO: emptyCart data logic
    return rep.response("TODO: cart should be emptied.").code(200);
  }

  // eslint-disable-next-line class-methods-use-this
  deleteCart(req, rep) {
    // If cart does not exist, error
    // Empty the cart.
    // Delete the cart.

    logger.debug(`Removing cart ${req.params.id}`);
    // TODO: deleteCart data logic
    return rep.response("TODO: cart should be deleted.").code(200);
  }

  // eslint-disable-next-line class-methods-use-this
  getProducts(req, rep) {
    // If cart does not exist, error.
    logger.debug(`Listing all products in ${req.params.id}`);
    return this.model.getProducts(req.params.id)
      .then((result) => {
        return rep.response({data: result}).code(200);
      })
    .catch(err => {
      logger.error(err.message);
    });


  }

  /**
   * Find an object by its id
   * @param  {Object} req - the request object
   * @param  {Object} rep - the response object
   */
  // findOneById(req, rep) {
  //   const id = req.params.id;
  //   const reply = rep;

  //   return this.model.findOneById(id)
  //     .then((result) => {
  //       logger.info(`Get request for ${this.model.resource}`);
  //       return reply.response(result).code(200);
  //     })
  //     .catch((err) => {
  //       logger.error(err.message);
  //     });
  // }

  // insert(req, rep) {
  //   const data = req.payload;
  //   const reply = rep;

  //   return this.model.insert(data)
  //     .then(result => reply.response(result).code(201))
  //     .catch(err => logger.error(err.message));
  // }
}

module.exports = Handlers;
