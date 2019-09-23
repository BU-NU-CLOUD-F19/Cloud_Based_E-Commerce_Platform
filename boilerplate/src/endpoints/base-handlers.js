'use strict';

const logger = require('../utils/logger');

class Handlers {
  constructor(model) {
    this.model = model;
  }

  findOne(req, rep) {
    const id = req.params.id;
    const reply = rep;
    logger.log('info', `Get request for ${this.model.resource}`);
    return reply.response(id).code(200);
  }

  insert(req, rep) {
    const request = req.payload;
    const reply = rep;

    return this.model.insert(request)
      .then(result => reply(result).code(201))
      .catch(err => logger.error(err.message));
  }
}

module.exports = Handlers;
