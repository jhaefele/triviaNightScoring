const {transports, createLogger, format} = require('winston')

module.exports = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    level: 'debug',
    transports: [
        new transports.Console({
            format: format.combine(
                format.simple()
            ),
        }),
        new transports.File({filename: 'error.log', level: 'error'}),
        new transports.File({filename: 'combined.log'}),
    ]
})