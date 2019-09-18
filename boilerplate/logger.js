const elv = require('elv');
const winston = require('winston');

const env = process.env.NODE_ENV;

const level = elv.coalesce(
  process.env.loglevel,
  (env === 'production' || env === 'test') ? 'error' : 'debug',
);

const logger = new (winston.Logger)({
  level,
  rewriters: [
    (level, msg, meta) => {
      meta.source = 'backend';
      return meta;
    },
  ],
  transports: [
    new (winston.transports.Console)({
      level,
      json: true,
      stringify: obj => JSON.stringify(obj),
    }),
  ],
});

module.exports = logger;
