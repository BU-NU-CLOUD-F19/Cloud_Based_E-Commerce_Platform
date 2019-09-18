'use strict';

const logger = require('./logger');

module.exports = function registrations(config) {
  // const authOptions = Object.assign({
  //   mode: 'required',
  // }, config.security);

  return [
    { plugin: './src/endpoints/demo' },
    {
      plugin: {
        register: 'good',
        options: {
          reporters: {
            console: [
              {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: { exclude: 'health' } }],
              },
              {
                module: endpoints.GoodWinston,
                args: [logger],
              },
            ],
          },
        },
      },
    },
  ];
};
