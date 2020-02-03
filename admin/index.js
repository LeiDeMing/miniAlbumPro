const Koa = require('koa'),
    bodyParser = require('koa-bodyparser'),
    nunjucks = require('koa-nunjucks-2'),
    path = require('path'),
    axios = require('axios'),
    koaStatic = require('koa-static');
const app = new Koa(),
    router = require('./router'),
    util = require('./util/util');

app.use(koaStatic(path.resolve(__dirname, 'public')))

app.use(nunjucks({
    ext: 'html',
    path: path.join(__dirname, 'views'),
    nunjucksConfig: {
        trimBlocks: true
    }
}))
 
router(app)

app
    .use(bodyParser())
    .use(async (ctx, next) => {
        let _match = ['/login', '/qrcode', '/token', '/check'].indexOf(ctx.request.path) >= 0

        if (!_match) {
            let token = util.getToken(ctx)
            if (!token) {
                util.redirectToLogin(ctx)
            } else {
                let res = await axios.get('https://api.ikcamp.cn/my', {
                    headers: {
                        'x-session': token
                    }
                })
                if (res.data.data && res.data.data.isAdmin) {
                    ctx.state.token = token
                    await next()
                } else {
                    util.redirectToLogin(ctx)
                }
            }
        } else {
            await next()
        }
    })
   

app.listen(3340, () => {
    console.log('server启动，port -> 3340')
})