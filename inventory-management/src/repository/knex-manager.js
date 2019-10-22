/**
 * Kernel is used to better manage Knex instances across the app.
 Because Kernel bindings must be objects, we created a Knex manager class.
 */

// Import the defined Jerkface container
const Kernel = require('./kernel');

// Manages the Knex instance
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

// Add the class to the Kernel container
Kernel.bind('knex-manager', KnexManager);

module.exports = KnexManager;