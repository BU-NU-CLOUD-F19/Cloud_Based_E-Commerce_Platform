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
