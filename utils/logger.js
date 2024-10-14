const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const path = require('path');

// Define a custom format for logs
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create Winston logger
const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        // Logs will be stored in the file 'application.log'
        new transports.File({ filename: path.join(__dirname, '/../logs/log-api-promaparams.log') })
    ]
});

module.exports = logger;
