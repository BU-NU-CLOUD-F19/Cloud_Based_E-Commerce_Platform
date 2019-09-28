/**
 * This is a handler for all the requests to `demo` resource.
 * It extends the base handler class to leverage all the default routes.
 */

'use strict';

const BaseHandler = require('../base-handler');

const Model = require('../../models').demo.Model;

class Handlers extends BaseHandler {
  constructor(model) {
    const m = model || (new Model());
    super(m);
  }
}

module.exports = Handlers;
