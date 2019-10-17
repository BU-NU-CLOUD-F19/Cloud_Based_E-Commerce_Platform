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
    }
};

module.exports = wrappers;