// Winston: a logging library (https://github.com/winstonjs/winston)
const { createLogger, format, transports } = require('winston');
const { combine, colorize, timestamp, label, printf } = format;

// Allowing rotating the logfile
require('winston-daily-rotate-file');

// Path: allows working with file and dir paths (https://nodejs.org/api/path.html)
const path = require('path');

// Allows interacting with the filesystem (https://nodejs.org/api/fs.html)
const fs = require('fs');

// Development or production
// process.env is injected by Node at runtime
const env = process.env.NODE_ENV;

// Where to log
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'results.log');

// creates a new log file everyday
// https://www.npmjs.com/package/winston-daily-rotate-file
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: 'YYYY-MM-DD',
});

// set the level based on env
const level = process.env.loglevel || ((env === 'production' || env === 'test') ? 'error' : 'debug')

// Create the Winston logger
const winstonLogger = createLogger({
  level,
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  // Sets up the logging destinations
  // Might also be worth directing errors to a separate error.log
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
    dailyRotateFileTransport // see declaration for more details
  ],
});

module.exports = winstonLogger;
