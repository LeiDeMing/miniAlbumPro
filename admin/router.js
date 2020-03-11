const router = require('koa-router')();
const loginController = require('./controller/login'),
    photosController = require('./controller/photo'),
    userController = require('./controller/user');
module.exports = (app) => {
    //登陆
    router.get('/', loginController.index)
    router.get('/login', loginController.index)
    router.get('/qrcode', loginController.getQrcode)
    router.get('/token', loginController.getToken)
    router.get('/check', loginController.checkAuth)

    //获取照片
    router.get('/photos/:status', photosController.getPhotos)
    //操作照片 put请求，因为c端传到s端时，s端拿不到传递的参数，所以用get请求
    router.get('/getphotos/:id', photosController.editPhotos)

    //获取用户
    router.get('/users/:status', userController.getUser)
    //操作用户权限 与操作照片同理
    router.get('/getusers/:id', userController.editUsers)

    app
        .use(router.routes())
        .use(router.allowedMethods())
}