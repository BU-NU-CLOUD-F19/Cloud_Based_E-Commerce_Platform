/**
 * This is the starting point of the application.
 * It defines the logic to start the api-server with provided configurations.
 */

'use strict';

const elv = require('elv');
const Glue = require('@hapi/glue');
const registrationsFactory = require('./registrations');
const config = require('./src/configs/config');
const logger = require('./src/utils/logger');


module.exports = new Promise(resolve => config.then(async (conf) => {
  const registrations = registrationsFactory(conf);

  const port = elv.coalesce(process.env.PORT, 3000);

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
    .then(() => logger.log('info', `Server started at ports: ${port}`));
}));
