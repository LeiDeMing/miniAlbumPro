const Router = require('koa-router'),
    uuid = require('uuid'),
    multer = require('koa-multer'),
    path = require('path');
const router = new Router()

function getPageParams(ctx) {
    return {
        pageIndex: parseInt(ctx.query.pageIndex) || 1,
        pageSize: parseInt(ctx.query.pageSize) || 10
    }
}

async function responseOk(ctx, next) {
    ctx.body = {
        status: 0
    }
    await next()
}

router.get('/login/ercode', async (ctx, next) => {
    ctx.logger.debug(`[login]生成登陆二维码`)
    ctx.body = {
        status: 0,
        data: await account.getErcode()
    }
})