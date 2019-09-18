'use strict';

const knex = require('knex');

let _knexInstace;

function getKnex(connection, pool) {
  if (!_knexInstace) {
    _knexInstace = knex({
      client: 'pg',
      connection,
      pool,
    });
  }
  return _knexInstace;
}

module.exports = getKnex;
