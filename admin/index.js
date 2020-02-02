const Koa = require('koa'),
    bodyParser = require('koa-bodyparser'),
    nunjucks = require('koa-nunjucks-2'),
    path = require('path'),
    static = require('koa-static');
const app = new Koa();

app.use(static(path.resolve(__dirname, './public')))
app.use(nunjucks({
    ext: 'html',
    path: path.join(__dirname, 'views'),
    nunjucksConfig: {
        trimBlocks: true
    }
}))

app
    .use(bodyParser)

app.listen(3340, () => {
    console.log('server启动，port -> 3340')
})