const Koa = require('koa'),
    bodyParser = require('koa-bodyparser'),
    router = require('koa-router');

const JSON_MIME = 'application/json',
    app = new Koa(),
    logger = require('./middlewares/log'),
    router = require('./router');

app
    .use(logger)
    .use(bodyParser({
        multipart: true
    }));
app.use(async (ctx, next) => {
    ctx.type = JSON_MIME;
    await next();
});
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        ctx.logger.error(e.stack || ex);
        ctx.body = {
            status: -1,
            message: e.message || ex,
            code: e.status
        }
    }
})
app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3389, () => {
    console.log('server start at 3389');
})