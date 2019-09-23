const elv = require('elv');
const BaseRouter = require('../base-router');

const Handlers = require('./handlers');

const resource = require('../../configs/classNames').demo;

class Router extends BaseRouter {
  constructor(handler) {
    const h = elv.coalesce(handler, () => new Handlers());
    super(resource, h);
  }
}

module.exports = Router;
