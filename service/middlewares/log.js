const log4js = require('log4js');
console.log(process.env)
const env = 'process.env.NODE.ENV';
log4js.configure({
    appenders: {
        everything: {
            type: 'file',
            filename: 'logs/app.log',
            maxLogSize: 10485760,
            backups: 3,
            comperss: true
        },
        dev: {
            type: 'console'
        }
    },
    categories: {
        default: {
            appenders: ['everything'],
            level: 'info'
        },
        dev: {
            appenders: ['dev', 'everything'],
            level: 'debug'
        }
    }
})

let logger = log4js.getLogger();
if (env !== 'produciton') {
    logger = log4js.getLogger('dev');
}

module.exports = async function (ctx, next) {
    ctx.logger = logger;
    ctx.logger.info(JSON.stringify({
        url: ctx.url,
        query: ctx.query,
        headers: ctx.headers,
        ua: ctx.userAgent,
        timespan: Date.now(),

    }));
    await next();
}