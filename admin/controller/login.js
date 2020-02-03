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
        const res  = await axios.get(`${config.apiUrl}/login/ercode`)
        console.log(res)
    }
}