/**
 * This class defines all the routes to be registered on this application server
 */

'use strict';
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const pkg = require('./package');

module.exports = function registrations(config) {
  const swaggerOptions = {
    swagger: '3.0',
    info: {
            version: pkg.version,
            title: 'Test API Documentation',
        },
    };
  return {
    plugins: [
      {
        plugin: './src/endpoints/demo', // copy and paste this line for all the different resources
        options: { select: ['api'] },
      },
      Inert,
      Vision,
      {
          plugin: HapiSwagger,
          options: swaggerOptions
      }
    ],
  };
};
