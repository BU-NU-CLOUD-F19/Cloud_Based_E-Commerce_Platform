const elv = require('elv');
const { createLogger, format, transports } = require('winston');

const { combine, colorize, timestamp, label, printf } = format;
require('winston-daily-rotate-file');

const path = require('path');

const env = process.env.NODE_ENV;
const logDir = 'log';

const filename = path.join(logDir, 'results.log');

// creates a new log file everyday
// eslint-disable-next-line no-unused-vars
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: 'YYYY-MM-DD',
});

// set the level based on env
const level = elv.coalesce(
  process.env.loglevel,
  (env === 'production' || env === 'test') ? 'error' : 'debug',
);

const winstonLogger = createLogger({
  level,
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    new transports.Console({
      level,
      json: true,
      stringify: obj => JSON.stringify(obj),
      format: combine(
        colorize(),
        printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
      ),
    }),
    new transports.File({
      filename,
      json: true,
      stringify: obj => JSON.stringify(obj),
      format: combine(
        label({ label: path.basename(process.mainModule.filename) }),
        printf(
          info =>
            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`,
        ),
      ),
    }),
    dailyRotateFileTransport
  ],
});


module.exports = winstonLogger;
