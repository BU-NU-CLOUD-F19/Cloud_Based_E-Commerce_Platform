/**
 * This file should be extended by all the request handlers implemented.
 * It is the base class that contains the request handling logic for
 * GET POST, PUT, PATCH, DELETE requests for the resources
 */

'use strict';

const logger = require('../utils/logger');
const Model = require('../models').cart.Model;

class Handlers {
  constructor(model) {
    this.model = model || (new Model());
  }

  /**
   * Find an object by its id
   * @param  {Object} req - the request object
   * @param  {Object} rep - the response object
   */
  findOneById(req, rep) {
    const id = req.params.id;
    const reply = rep;

    return this.model.findOneById(id)
      .then((result) => {
        logger.info(`Get request for ${this.model.resource}`);
        return reply.response(result).code(200);
      })
      .catch((err) => {
        logger.error(err.message);
      });
  }

  insert(req, rep) {
    const data = req.payload;
    const reply = rep;

    return this.model.insert(data)
      .then(result => reply.response(result).code(201))
      .catch(err => logger.error(err.message));
  }
}

module.exports = Handlers;
