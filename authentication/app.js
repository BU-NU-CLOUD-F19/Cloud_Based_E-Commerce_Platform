/**
 * This is the starting point of the application.
 * It defines the logic to start the api-server with provided configurations.
 * It's executed by pm2, via ./process.json.
 */

'use strict';

// A server composer for the Hapi server
// https://github.com/hapijs/glue
const Glue = require('@hapi/glue');

// Route registrations for Hapi
const registrationsFactory = require('./registrations');

// Global configuration for the app
const config = require('./src/configs/config');
const logger = require('./src/utils/logger');


module.exports = new Promise(resolve => config.then(async (conf) => {
  const registrations = registrationsFactory(conf);

  const port = process.env.AUTH_PORT || 4050;

  const manifest = {
    server: {
      port,
    },
    register: registrations,
  };

  const options = {
    relativeTo: __dirname,
  };


  const server = await Glue.compose(manifest, options);

  return server.start()
    .then(() => logger.info(`Server started at ports: ${port}`));
}));
