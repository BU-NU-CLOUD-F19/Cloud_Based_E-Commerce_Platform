'use strict';

const fs = require('fs');
const path = require('path');
const elv = require('elv');
const Glue = require('glue');
const Promise = require('bluebird');
const registrationsFactory = require('./registrations');
const config = require('./config');

const isProduction = (process.env.NODE_ENV === 'production');


module.exports = new Promise((resolve) => {
  return config.then(async (conf) => {
    const registrations = registrationsFactory(conf);

    const port = elv.coalesce(process.env.PORT, 3000);

    const manifest = {
      server: {
        connections: {
          routes: {
            cors: {
              credentials: false,
              origin: elv.coalesce(
                process.env.CORS_ORIGIN,
                'http://localhost:8000')
                .split(','),
              additionalHeaders: [
                'cache-control',
                'x-requested-with',
                'if-match',
                'authorization',
                'etag',
              ],
            },
          },
        },
      },
      connections: [
        {
          host: '0.0.0.0',
          port,
          labels: ['api'],
        },
      ],
      registrations,
    };

    const options = {
      relativeTo: __dirname,
    };


    Glue.compose(manifest, options, (err, server) => {
      if (err) {
        throw err;
      }
      server.start((err) => {
        if (err)
          throw err;
        server.log(['info', 'start'], `Server started at ports: ${port}`);
        resolve(server);
      });

      // Register events handlers
      eventsRegistration();
    });
  });
});
