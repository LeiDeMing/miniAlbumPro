const router = require('koa-router')();
const loginController = require('./controller/login')

module.exports = (app) => {
    //登陆
    router.get('/', loginController.index)
    router.get('/login', loginController.index)

    //获取照片
    router.get('/photos/:status', async (ctx, next) => {

    })
    //操作照片
    router.put('/photos/:id', async (ctx, next) => {

    })

    //获取用户
    router.get('/users/:status', async (ctx, next) => {

    })
    //操作用户权限
    router.get('/users/:id', async (ctx, next) => {

    })

    app
        .use(router.routes())
        .use(router.allowedMethods())
}