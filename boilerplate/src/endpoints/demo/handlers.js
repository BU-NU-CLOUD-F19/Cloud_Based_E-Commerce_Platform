/**
 * This is a handler for all the requests to `demo` resource.
 * It extends the base handler class to leverage all the default routes.
 */

'use strict';

const elv = require('elv');
const BaseHandler = require('../base-handler');

const Model = require('../../models').demo.Model;

class Handlers extends BaseHandler {
  constructor(model) {
    const m = elv.coalesce(model, () => new Model());
    super(m);
  }
}

module.exports = Handlers;
