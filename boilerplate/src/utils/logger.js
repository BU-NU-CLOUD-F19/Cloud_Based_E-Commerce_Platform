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
    error: ({error, url}, logger, level) => {
        logger.log(level, error.toString(), {
            type: 'response-error',
            stack: error.stack,
            url,
        });
    },
};

module.exports = wrappers;