/**
 * This file loads the global configuration required throughout the scope of the application.
 * The configurations to be loaded are located in `.rc` file.
 */

'use strict';

const _ = require('lodash');
const Kibbutz = require('kibbutz');
const RcProvider = require('kibbutz-rc');
const pkg = require('../../package');
const getKnex = require('../repository/knex');
const Kernel = require('../models/kernel');
// eslint-disable-next-line no-unused-vars
const KnexManager = require('../models/knex-manager'); // to bind knex-instance to kernel

const Names = require('../constants/modelNames');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const configName = pkg.config.appName;
const config = new Kibbutz();

// finds and loads .apirc
const rcLoader = new RcProvider({
  appName: configName,
});


// convert some conf values to int, based on given path
const converToInt = (conf, path) => {
  if (!_.has(conf, path)) {
    return;
  }

  const value = _.get(conf, path);
  _.set(conf, path, parseInt(value, 10));
};

module.exports = new Promise((resolve, reject) => {
  config.load([rcLoader], (err, conf) => {
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

    // resolves knex manager instance from the kernel
    const knexManager = Kernel.resolve(Names.knexManager);

    knexManager.knex = knexInstance;

    resolve(conf);
  });
});
