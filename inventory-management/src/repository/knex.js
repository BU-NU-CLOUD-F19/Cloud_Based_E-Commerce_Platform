'use strict';

/**
 * This class instantiates knex query-builder object.
 * For more details: http://knexjs.org/
*/

// Knex: SQL query builder for JS
const knex = require('knex');

let _knexInstace;

// Defaults to a PostgreSQL database
function getKnex(connection, pool) {
    if (!_knexInstace) {
        _knexInstace = knex({
            client: process.env.DB_CLIENT || 'pg',
            connection,
            pool,
        });
    }
    return _knexInstace;
}

module.exports = getKnex;