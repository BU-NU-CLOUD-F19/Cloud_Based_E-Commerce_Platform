// Use the custom Winston logger
const logger = require('./winstonLogger');

// Creat convenience methods for logging
const wrappers = {
    log: (lvl, data) => {
        logger.log(lvl, data);
    },
    info: (data) => {
        logger.log('info', data);
    },
    error: (data) => {
        logger.log('error', data);
    },
    warn: (data) => {
        logger.log('warn', data);
    },
    debug: (data) => {
        logger.log('debug', data);
    },
    /**
    * Log a Hapi request
    * @param {Hapi.request} req - the request object
    */
    logRequest: (req) => {
      logger.log('info', `HTTP ${req.method} ${req.path}`);
    }
};

module.exports = wrappers;