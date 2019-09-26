/**
 * This class defines all the routes to be registered on this application server
 */

'use strict';
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

module.exports = function registrations(config) {
  const swaggerOptions = {
    info: {
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
