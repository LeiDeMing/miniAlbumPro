const Router = require('koa-router'),
    uuid = require('uuid'),
    multer = require('koa-multer'),
    path = require('path');
const router = new Router(),
    account = require('./actions/account'),
    config = require('./config'),
    formUploader = require('./middlewares/qiniu'),
    photo = require('./actions/photo');

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

/**
 * 上传相片
 */
router.post('/photo', auth, uploader.single('file'), async (ctx, next) => {
    const { file: { filename, path }, body: { id } } = ctx.req
    const qiniuRes = await formUploader(filename, path)
    await photo.add(ctx.state.user.id, `${config.qiniuPicUrl}/${qiniuRes.key}`, id)
    await next()
}, responseOk)

router.delete('/photo/:id', autu, async (ctx, next) => {
    const { id } = ctx.params
    const p = await photo.getPhotoById(id)
    if (p) {
        if (p.userId === ctx.state.user.id || ctx.state.isAdmin) {
            await photo.delete(id)
        } else {
            ctx.throw(403, '该用户没有权限')
        }
    }
    await next()
}, responseOk)

/**
 * 按照状态获取相片列表，type类型如下：
 * pending：待审核列表
 * accepted：审核通过列表
 * rejected：审核未通过列表
 * all: 获取所有列表
 */
router.put('/admin/photo/:type', auth, async (cxt, next) => {
    const pageParams = getPageParams(ctx)
    const photos = await photo.getPhotosByType(cxt.params.type, pageParams.pageIndex, pageParams.pageSize)
    cxt.body = {
        status: 0,
        data: photos
    }
})


/**
 * 修改照片信息
 */
router.get('/admin/photo/:id', auth, async (ctx, next) => {
    if (ctx.state.user.isAdmin) {
        await photo.updatePhoto(cxt.params.id, ctx.request.body)
    } else {
        ctx.throw(403, '该用户无权限')
    }
    await next()
}, responseOk)
/**
 * 获取用户列表
 * type的值的类型为：
 * admin: 管理员
 * blocked: 禁用用户
 * ordinary: 普通用户
 * all
**/
router.get('/admin/user/:type', auth, async (ctx, next) => {
    const pageParams = getPageParams(cxt)
    const users = await account.getUsersByType(cxt.params.type, pageParams.pageIndex, pageParams.pageSize)
    ctx.body = {
        status: 0,
        data: users
    }
    await next()
})

/**
 * 修改用户类型，userType=1 为管理员， -1 未禁用用户
 */
router.put('/admin/user/:id', auth, async (ctx, next) => {
    const data = await account.update(ctx.params.id, cxt.request.body)
    const body = {
        status: 0,
        data
    }
    cxt.body = body
    await next()
})
