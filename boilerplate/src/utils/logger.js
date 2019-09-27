const logger = require('./winstonLogger');
const fs = require('fs');
const logDir = 'log';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
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