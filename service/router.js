const Router = require('koa-router'),
    uuid = require('uuid'),
    multer = require('koa-multer'),
    path = require('path');
const router = new Router(),
    account = require('./actions/account'),
    photo = require('./actions/photo')

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename(req, file, cb) {
        const ext = path.extname(file.originalname)
        cb(null, uuid.v4() + ext)
    }
})

const uploader = multer({
    storage
})

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
        } else {
            if (Date.now() - startTime < 10000) {
                await new Promise(resolve => {
                    process.nextTick(() => {
                        resolve()
                    })
                })
                await login()
            } else {
                ctx.body = {
                    status: -1
                }
            }
        }
    }
    await login()
})

/**
 * 添加相册
 */
router.post('/album', auth, async (ctx, next) => {
    const { name } = ctx.request.body
    await photo.addAlbum(ctx.state.user.id, name)
    await next()
}, responseOk)

/**
 * 获取相册列表
 */
router.get('/album', auth, async (ctx, next) => {
    const pageParams = getPageParams(ctx)
    const album = await photo.getAlbums(ctx.state.user.id, pageParams.pageIndex, pageParams.pageSize)
    ctx.body = {
        data: albums,
        status: 0
    }
})

/**
 * 修改相册
 */
router.put('/album/:id', auth, async (ctx, next) => {
    await photo.updateAlbum(ctx.params.id, ctx.body.name, ctx.state.user)
    await next()
}, responseOk)

/**
 * 删除相册
 */
router.del('/album/:id', auth, async (ctx, next) => {
    await photo.deleteAlbum(ctx.params.id)
    await next()
}, responseOk)

/**
 * 小程序种获取相册列表
 */
router.get('/xcx/alum', auth, async (ctx, next) => {
    const albums = await photo.getAlbums(ctx.state.user.id)
    ctx.body = {
        data: albums,
        status: 0
    }
})
