const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
/**
 * Global file logger.
 * Call info, warn or error methods with appropriate message.
 * @class theLog
 */
class theLog {
    constructor(fileName) {
        this.fileName = fileName.split(/[\\/]/).pop();
    }
    info(message) {
        const level = 'info';
        this.loggit(level, message);
    }
    warn(message) {
        const level = 'warn';
        this.loggit(level, message);
    }
    error(message) {
        const level = 'error';
        this.loggit(level, message);
    }
    loggit(level, message) {
        const myFormat = printf(({ level, message, label, timestamp }) => {
            return `${timestamp} [${label}] ${level}: ${message}`;
        });
        const logger = createLogger({
            format: combine(
                timestamp(),
                label({ label: this.fileName }),
                myFormat,
                format.json(),
            ),
            transports: [
                new transports.File({
                    filename:
                        '/home/tom/Code/hackathons/ethglobal/snaps-cli/examples/recipient-address-auditor/combined.log',
                }),
            ],
            exceptionHandlers: [
                new transports.File({
                    filename:
                        '/home/tom/Code/hackathons/ethglobal/snaps-cli/examples/recipient-address-auditor/exceptions.log',
                }),
            ],
        });
        if (process.env.NODE_ENV !== 'production') {
            logger.add(
                new transports.Console({
                    format: combine(format.colorize(), myFormat),
                }),
            );
        }
        logger[level](message.toString());
    }
}

module.exports = { theLog };
