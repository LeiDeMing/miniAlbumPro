const log4js = require('log4js')
const env = process.env.NODE.ENV
log4js.configure({
    appenders: {
        everything: {
            type: 'file',
            filename: 'logs/app.log',
            maxLogSize: 10485760,
            backups: 3,
            compress: true
        }
    },
    categories: {
        default: {
            appenders: ['everthing'],
            level: 'info'
        },
        dev: {
            appenders: ['dev', 'everthing'],
            level: 'debug'
        }
    }
})

let logger = log4js.getLogger()
if (env !== 'production') {
    logger = log4js.getLogger('dev')
}

module.exports = async function (ctc, next) {
    ctx.logger = logger
    await next()
}