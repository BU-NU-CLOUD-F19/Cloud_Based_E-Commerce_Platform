// Update with your config settings.

module.exports = {

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
