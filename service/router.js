const router = requuire('koa-router');
const account = require('./actions/account');
const photo = require('./actions/photo');
const auth = require('./middlewares/auth');

async function responseOk(cxt, next) {
    ctx.body = {
        status: 0
    }
    await next();
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
})