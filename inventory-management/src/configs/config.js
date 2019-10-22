/**
 * This file loads the global configuration required throughout the scope of the application.
 * The configurations to be loaded are located in `.rc` file.
 */

'use strict';

// General-purpose utility library (https://lodash.com)
const _ = require('lodash');

// Configuration aggregator/manager (https://www.npmjs.com/package/kibbutz)
const Kibbutz = require('kibbutz');

// RC file configuration provider for Kibbutz (https://www.npmjs.com/package/kibbutz-rc)
// Provides options to configure the rc module (https://www.npmjs.com/package/rc)
const RcProvider = require('kibbutz-rc');

// The application's 'package.json'
const pkg = require('../../package.json');

// Class that gets the Knex db query builder instance
const getKnex = require('../repository/knex');

// Jerkface container that holds names mapped to class isntances
const Kernel = require('../repository/kernel');

// A logger for the application, writes to ./log
const logger = require('../utils/logger');

// Adds the Knex instance to the Kernel container, to be able to access it
require('../repository/knex-manager');

// Define global model names
const Names = require('../constants/modelNames');

// Set a default node environment
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

// Get the app name, which is used by convention to load the rc file
const configName = pkg.config.appName;
logger.info(`App name: ${configName}`);


// finds and loads .boilerplaterc
// via Kibbutz: https://www.npmjs.com/package/kibbutz-rc
// this uses the rc module: https://www.npmjs.com/package/rc
const config = new Kibbutz();
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


// This is what actually executes
module.exports = new Promise((resolve, reject) => {
    // Load the .{appname}rc file
    config.load([rcLoader], (err, conf) => {
        if (err) {
            reject(err);
        }
        converToInt(conf, 'persistence.postgres.pool.min');
        converToInt(conf, 'persistence.postgres.pool.max');

        // Create the shared Kibbutz configuration based on the rc
        Kibbutz.shared = new Kibbutz({
            value: conf,
        });

        // Extract the database connection info
        const {
            connection,
            pool,
        } = conf.persistence.postgres;
        logger.info(`PG connection: ${connection.host}, DB ${connection.database}`);

        // Get a knex instance which will be used to transact with db
        const knexInstance = getKnex(connection, pool);

        // Resolve knex manager instance from the kernel
        const knexManager = Kernel.resolve(Names.knexManager);

        // load the knex instance into knex-manager which will be used throughout application
        knexManager.knex = knexInstance;

        // Resolve the promise with the loaded config
        resolve(conf);
    });
});