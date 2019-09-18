'use strict';

const elv = require('elv');
const BaseHandlers = require('../base-handlers');

const Model = require('../../models').demo.Model;

class Handlers extends BaseHandlers {
  constructor(model) {
    const m = elv.coalesce(model, () => new Model());
    super(m);
  }
}

module.exports = Handlers;
