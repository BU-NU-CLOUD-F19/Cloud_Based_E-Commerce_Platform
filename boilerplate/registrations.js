/**
 * This class defines all the routes to be registered on this application server
 */

'use strict';


module.exports = function registrations(config) {
  return {
    plugins: [
      {
        plugin: './src/endpoints/demo',
        options: { select: ['api'] },
      },
    ],
  };
};
