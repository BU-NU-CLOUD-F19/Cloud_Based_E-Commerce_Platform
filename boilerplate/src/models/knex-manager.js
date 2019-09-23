const Kernel = require('./kernel');
/**
* Kernel is used to better manage Knex instances across the app.

Because Kernel bindings must be objects, we created a Knex manager class.
 */
class KnexManager {
  constructor() {
    this._knex = null;
  }

  get knex() {
    return this._knex;
  }

  set knex(knexInstance) {
    this._knex = knexInstance;
  }
}

Kernel.bind('knex-manager', KnexManager);

module.exports = KnexManager;
