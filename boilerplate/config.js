'use strict';

const _ = require('lodash');
const Kibbutz = require('kibbutz');
const EnvProvider = require('./provider');
const RcProvider = require('kibbutz-rc');
const pkg = require('../package');
const Knex = require('knex');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const configName = pkg.config.appName;
const config = new Kibbutz();
//const envLoader = new EnvProvider(configName);
const rcLoader = new RcProvider({
  appName: configName,
});

module.exports = new Promise((resolve, reject) => {
  // config.load([envLoader, rcLoader], (err, conf) => {
  config.load([rcLoader], (err, conf) => {
    if (err) {
      reject(err);
    }

    Kibbutz.shared = new Kibbutz({
      value: conf,
    });

    const {
      connection,
      pool,
    } = conf.persistence.postgres;

    const knexInstance = Knex({
      client: 'pg',
      connection,
      pool,
    });
    const knexManager = Kernel.resolve('knex-manager');
    knexManager.knex = knexInstance;

    resolve(conf);
  });
});
