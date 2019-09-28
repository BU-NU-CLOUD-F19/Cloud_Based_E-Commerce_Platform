/**
 * This class defines all the routes to be registered on this application server.
 * According to: https://github.com/hapijs/glue/blob/master/API.md#await-composemanifest-options
 */

'use strict';

module.exports = function registrations(config) {
  return {
    // Each string in this array is `require`d during composition
    plugins: [
      './src/endpoints/demo',
    ],
  };
};
