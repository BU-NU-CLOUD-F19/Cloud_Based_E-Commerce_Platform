'use strict';

const fs = require('fs');
const path = require('path');
const elv = require('elv');
const Glue = require('@hapi/glue');
const Promise = require('bluebird');
const registrationsFactory = require('./registrations');
const config = require('./config');
const logger = require('./src/utils/logger');

const isProduction = (process.env.NODE_ENV === 'production');


module.exports = new Promise((resolve) => {
  return config.then(async (conf) => {
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
    .then(() => {
       return logger.log('info',`Server started at ports: ${port}`);
    });
  });
});
