'use strict';

const logger = require('./src/utils/logger');

module.exports = function registrations(config) {
  // const authOptions = Object.assign({
  //   mode: 'required',
  // }, config.security);

  return {
    plugins: [
      {
      plugin: './src/endpoints/demo',
      options: { select: [ 'api' ] }
      }
    ]
  };
};
