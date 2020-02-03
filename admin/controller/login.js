const axios = require('axios');
const util = require('../util/util'),
    config = require('../config');

module.exports = {
    index: async (ctx, next) => {
        if (ctx.state.token) {
            ctx.status = 302
            ctx.redirect('/photos/all')
        } else {
            await ctx.render('login/login')
        }
    },
    getQrcode: async (ctx, next) => {
        const res = await axios.get(`${config.apiUrl}/login/ercode`)
        ctx.response.body = res.data.data
    },
    getToken: async (ctx, next) => {
        try {
            const res = await axios.get(`${config.apiUrl}/login/ercode/check/${ctx.query.code}`)
            ctx.response.body = res.data
            if (res.data.data) {
                util.setToken(ctx, res.data.data.sessionKey)
            }
        }catch(e){
            ctx.status = 500
            ctx.response.body = '超时'
        }
    }
}