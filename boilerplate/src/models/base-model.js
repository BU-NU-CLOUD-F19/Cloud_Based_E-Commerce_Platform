'use strict';

const Kernel = require('../../kernel');

class Model {
  constructor(options) {
    this.resource = options.resource;
    this.repository = options.repository;
  }

  insert(value) {
    return this.repository.insert(value)
      .then((result) => {
        return result.value;
      });
  }

  findOne(id) {
    return this.repository.findOne(id)
      .then((entity) => {
        return entity.data;
      });
  }

}

Kernel.bind('model', Model);

module.exports = Model;
