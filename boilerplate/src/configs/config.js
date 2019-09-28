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
const logger = require('../utils/logger');
// eslint-disable-next-line no-unused-vars
const KnexManager = require('../models/knex-manager'); // to bind knex-instance to kernel

const Names = require('../constants/modelNames');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const configName = pkg.config.appName;
logger.log('info', `App name: ${configName}`);
const config = new Kibbutz();

// finds and loads .boilerplaterc
// via Kibbutz: https://www.npmjs.com/package/kibbutz-rc
// this uses the rc module: https://www.npmjs.com/package/rc
const rcLoader = new RcProvider({
  // configName is set in the rc
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
    logger.log('info', `PG connection: ${connection.host}, DB ${connection.database}`);

    // get a knex instance which will be used to transact with db
    const knexInstance = getKnex(connection, pool);

    // resolves knex manager instance from the kernel
    const knexManager = Kernel.resolve(Names.knexManager);

    // load the knex instance into knex-manager which will be used throughout application
    // e.g. look at demo model's constructor
    knexManager.knex = knexInstance;

    resolve(conf);
  });
});
