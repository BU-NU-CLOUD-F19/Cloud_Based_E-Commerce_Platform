'use strict';

const _ = require('lodash');
const Kibbutz = require('kibbutz');
const EnvProvider = require('./provider');
const RcProvider = require('kibbutz-rc');
const pkg = require('./package');
const getKnex = require('./repository/knex');
const Kernel = require('./kernel');
const KnexManager = require('./knex-manager'); // to bind knex-instance to kernel

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const configName = pkg.config.appName;
const config = new Kibbutz();
const envLoader = new EnvProvider(configName);
const rcLoader = new RcProvider({
  appName: configName,
});

const converToInt = (conf, path) => {
  if (!_.has(conf, path)) {
    return;
  }

  const value = _.get(conf, path);
  _.set(conf, path, parseInt(value, 10));
};

module.exports = new Promise((resolve, reject) => {
  // config.load([envLoader, rcLoader], (err, conf) => {
  config.load([ rcLoader, envLoader ], (err, conf) => {
    if (err) {
      reject(err);
    }
    converToInt(conf, 'persistence.postgres.pool.min');
    converToInt(conf, 'persistence.postgres.pool.max');

    Kibbutz.shared = new Kibbutz({
      value: conf,
    });

    const {
      connection,
      pool,
    } = conf.persistence.postgres;

    const knexInstance = getKnex(connection, pool);

    // TODO: add comments
    const knexManager = Kernel.resolve('knex-manager');
    knexManager.knex = knexInstance;

    resolve(conf);
  });
});
