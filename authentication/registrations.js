/**
 * This class defines all the routes to be registered on this application server.
 * According to: https://github.com/hapijs/glue/blob/master/API.md#await-composemanifest-options
 */

'use strict';

const HapiFirebaseAuth = require('hapi-firebase-auth');
const AuthService = require('./auth');

module.exports = function registrations(config) {
  return {
    // Each string in this array is `require`d during composition
    plugins: [
      HapiFirebaseAuth,
      AuthService,
      './src/endpoints/memberships',
      './src/endpoints/security-groups',
      './src/endpoints/stores',
      './src/endpoints/user-security-groups',
      './src/endpoints/users',
    ],
  };
};
