const router = require('koa-router')(),
    path = require('path'),
    uuid = require('uuid'),
    multer = require('koa-multer');
const account = require('./actions/account'),
    photo = require('./actions/photo'),
    config = require('./config'),
    formUploader = require('./middlewares/qiniu'),
    auth = require('./middlewares/auth');

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename(req, file, cb) {
        const ext = path.extname(file.originalname)
        cb(null, uuid.v4() + ext)
    }
})

const uplader = multer({
    storage: storage
})

async function responseOk(ctx, next) {
    ctx.body = {
        status: 0
    }
    await next();
}

function getPageParams(ctx) {
    return {
        pageIndex: parseInt(ctx.query.pageIndex) || 1,
        pageSize: parseInt(ctx.query.pageSize) || 10
    }
}

router.get('/my', auth, async (ctx, next) => {
    // ctx.response.status = 200
    ctx.body = {
        status: 0,
        data: ctx.state.user
    }
})

router.put('/user', auth, async (ctx, next) => {
    ctx.logger.info(`[user]修改用户信息，用户ID为${ctx.state.user.id},修改的内容为${JSON.stringify(ctx.request.body)}`)
    await account.update(ctx.state.user.id, ctx.request.body);
    await next()
}, responseOk)

router.get('/login', async (ctx, next) => {
    const code = ctx.query.code;
    ctx.logger.info(`[login]用户登陆Code为${code}`);
    ctx.body = {
        status: 0,
        data: await account.login(code)
    }
})

router.get('/login/ercode', async (ctx, next) => {
    ctx.body = {
        status: 0,
        data: await account.getErCode()
    }
})

router.get('/login/ercode/:code', auth, async (ctx, next) => {
    const code = ctx.params.code;
    const sessionKey = ctx.get('x-session');
    await account.setSessionKeyForCode(code, sessionKey);
    await next();
}, responseOk)

router.get('/login/ercode/check/:code', async (ctx, next) => {
    const startTime = Date.now();
    async function login() {
        const code = ctx.params.code;
        const sessionKey = await account.getSessionKeyByCode(code);
        if (sessionKey) {
            ctx.body = {
                status: 0,
                data: {
                    sessionKey: sessionKey
                }
            }
        } else {
            if (Date.now() - startTime < 10000) {
                //等待下一个tick?
                await new Promise(resolve => {
                    process.nextTick(() => {
                        resolve();
                    })
                });
                await login();
            }
        }
    }
    await login();
})

router.post('/album', auth, async (ctx, next) => {
    const {
        name
    } = ctx.request.body;
    const isAlive = await photo.addAlbum(ctx.state.user.id, name);
    if (isAlive === true) {
        ctx.body = {
            status: -1
        }
    } else {
        ctx.body = {
            status: 0
        }
    }
    await next();
})

router.put('/album/:id', auth, async (ctx, next) => {
    await photo.updateAblum(ctx.params.id, ctx.body.name, ctx.uer);
    await next();
}, responseOk)

router.del('/album/:id', auth, async (ctx, next) => {
    await photo.deleteAlbum(ctx.params.id);
    await next();
}, responseOk)

router.get('/xcx/album', auth, async (ctx, next) => {
    const albums = await photo.getAlbums(ctx.state.user.id);
    ctx.body = {
        status: 0,
        data: albums
    }
    await next();
})

router.get('/xcx/album/:id', auth, async (ctx, next) => {
    const {
        id
    } = ctx.params
    const photos = await photo.getPhotos(ctx.state.user.id, id);
    ctx.body = {
        status: 0,
        data: photos
    }
    await next();
})

router.post('/photo', auth, uplader.single('file'), async (ctx, next) => {
    const {
        file: {
            filename,
            path
        }
    } = ctx.req;
    const {
        id
    } = ctx.req.body;
    const qiniuRes = await formUploader(filename, path)
    await photo.add(ctx.state.user.id, `${config.qiniuPicUrl}/${qiniuRes.key}`, id);
    await next();
}, responseOk)

router.delete('/photo/:id', auth, async (ctx, next) => {
    const {
        id
    } = ctx.params;
    const p = await photo.getPhotoById(id);
    if (p) {
        if (p.userId === ctx.state.user.id || ctx.state.user.isAdmin) {
            await photo.delete(id);
        } else {
            ctx.throw(403, '该用户没有权限')
        }
    }
    await next();
}, responseOk)

//获取照片
router.get('/admin/photo/:type', async (ctx, next) => {
    const params = getPageParams(ctx);
    const photos = await photo.getPhotosByApproveState(ctx.params.type, params.pageIndex, params.pageSize);
    ctx.body = {
        status: 0,
        data: photos
    }
})

// router.put('/admin/photo/approve/:id/:state', async (ctx, next) => {
//     await photo.approve(ctx.params.id, this.params.state);
//     await next();
// }, responseOk);

router.put('/admin/photo/:id', auth, async (ctx, next) => {
    if (ctx.state.user.isAdmin) {
        await photo.updatePhoto(ctx.params.id, ctx.request.body);
    }
    await next();
}, responseOk);

/**
 * 获取用户列表
 * type的值的类型为：
 * admin: 管理员
 * blocked: 禁用用户
 * ordinary: 普通用户
 * all: 全部用户
 */
router.get('/admin/user/:type', auth, async (ctx, next) => {
    const pageParams = getPageParams(ctx);
    ctx.body = {
        status: 0,
        data: await account.getUsersByType(ctx.params.type, pageParams.pageIndex, pageParams.pageSize)
    }
    await next();
})
/* 
    type 1 === 管理员
    type -1 === 禁用用户
    type 0 普通用户
    默认 type 0
*/
router.put('/admin/user/:id', auth, async (ctx, next) => {
    const body = {
        status: 0,
        data: await account.update(ctx.params.id, ctx.request.body)
    };
    ctx.body = body;
    await next();
})

module.exports = router