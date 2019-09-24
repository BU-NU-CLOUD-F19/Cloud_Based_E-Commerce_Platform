// Update with your config settings.

/**
 * This file will be used when running knex migrations
 */

module.exports = {

  // for development environment
  development: {
    client: 'postgresql',
    connection: {
      database: 'dev_db',
      user: 'postgres',
      password: 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: '_migrations',
    },
  },

  // for test environment
  test: {
    client: 'postgresql',
    connection: {
      database: 'test_db',
      user: 'postgres',
      password: 'postgres',
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: '_migrations',
    },
  },

};
