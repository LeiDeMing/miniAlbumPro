const Router = require('koa-router'),
    uuid = require('uuid'),
    multer = require('koa-multer'),
    path = require('path');
const router = new Router(),
    account = require('./actions/account')

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

/**
 * 扫码登陆，获取二维码字符串
 */
router.get('/login/ercode', async (ctx, next) => {
    ctx.logger.debug(`[login]生成登陆二维码`)
    ctx.body = {
        status: 0,
        data: await account.getErcode()
    }
})

/**
 * 扫码登陆中，小程序侧调用的接口。将扫到的二维码信息传递过来
 */
router.get('/login/ercode/:code', auth, async (ctx, next) => {
    const { params: { code } } = ctx
    const sessionKey = ctx.get('x-session')
    await account.setSessionKeyForCode(code, sessionKey)
    await next
}, responseOk)

/**
 * 轮询检查登陆状态
 */
router.get('/login/errcode/check/:code', async (ctx, next) => {
    const startTime = Date.now()
    async function login() {
        const { params: { code } } = ctx
        const sessionKey = await account.getSessionKeyByCode(code)
        if (sessionKey) {
            ctx.body = {
                status: 0,
                data: {
                    sessionKey
                }
            }
        }
    }
})

