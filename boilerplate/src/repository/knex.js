'use strict';

/**
 * This class instantiates knex query-builder object.
 * For more details: http://knexjs.org/
*/

const knex = require('knex');

let _knexInstace;

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
