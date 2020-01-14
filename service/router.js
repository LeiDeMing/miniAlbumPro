const router = requuire('koa-router'),
    path = require('path'),
    multer = require('koa-multer');
const account = require('./actions/account'),
    photo = require('./actions/photo'),
    auth = require('./middlewares/auth');

async function responseOk(cxt, next) {
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
                staus: 0,
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

router.post('/ablum', auth, async (ctx, next) => {
    const {
        name
    } = ctx.request.body;
    await photo.addAlbum(ctx.state.user.id, name);
    await next();
})

router.put('/albu/:id', auth, async (ctx, next) => {
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

router.post('/photo', auth, uplader.single('file'), async (ctx, next) => {
    const {
        file
    } = ctx.req;
    const {
        id
    } = ctx.req.body;
    await photo.add(ctx.state.user.id, `https://static.ikcamp.cn/${file.filename}`, id);
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

router.get('/admin/user', async (ctx, next) => {
    const pageParams = getPageParams(ctx);
    ctx.body = {
        status: 0,
        data: await account.getUsers(pageParams.pageIndex, pageParams.pageSize)
    }
    await next();
})
/* 
    type 1 === 管理员
    type -1 === 禁用用户
    type 0 普通用户
    默认 type 0
*/
router.get('/admin/user/:id/:userType/:type', async (ctx, next) => {
    const body = {
        status: 0,
        data: await account.setUserType(ctx.params.id, ctx.params.type)
    };
    ctx.body = body;
    await next();
})

router.get('/admin/photo/:type', async (ctx, next) => {
    const params = getPageParams(ctx);
    const photos = await photo.getPhotosByApproveState(ctx.params.type, params.pageIndex, params.pageSize);
    ctx.body = {
        status: 0,
        data: photos
    }
})
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, uuid.v4() + ext)
    }
})

const uplader = multer({
    storage: storage
})