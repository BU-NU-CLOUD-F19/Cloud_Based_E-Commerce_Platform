'use strict';
const logger = require('winston');

class Handlers {
  constructor(model) {
    this.model = model;
  }

  findOne(req, rep) {
    const id = req.params.id;
    const reply = rep;

    return this.model.findOne(context, id)
      .then((result) => {
        return reply(result).code(200);
      })
      .catch((err) => {
        return logger.error(err.message);
      });
  }

  insert(req, rep) {
    const request = req.payload;
    const reply = rep;

    return this.model.insert(request)
      .then((result) => {
        return reply(result).code(201);
      })
      .catch((err) => {
        return logger.error(err.message);
      });
  }
}

module.exports = Handlers;
