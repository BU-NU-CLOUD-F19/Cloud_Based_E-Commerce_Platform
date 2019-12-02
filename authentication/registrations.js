/**
 * This class defines all the routes to be registered on this application server.
 * According to: https://github.com/hapijs/glue/blob/master/API.md#await-composemanifest-options
 */

'use strict';

const HapiFirebaseAuth = require('hapi-firebase-auth');
const AuthService = require('./auth'); // to register the auth plugin

const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const pkg = require('./package');

module.exports = function registrations(config) {
  const swaggerOptions = {
    swagger: '2.0',
    info: {
            version: pkg.version,
            title: 'Auth API Documentation',
        },
    };
  return {
    // Each string in this array is `require`d during composition
    plugins: [
      HapiFirebaseAuth,
      AuthService,
      './src/endpoints/auth-token',
      './src/endpoints/memberships',
      './src/endpoints/security-groups',
      './src/endpoints/stores',
      './src/endpoints/user-security-groups',
      './src/endpoints/users',
      Inert,
      Vision,
      {
          plugin: HapiSwagger,
          options: swaggerOptions
      }
    ],
  };
};
