const axios = require('axios');
const util = require('../util/util');

module.exports = {
    index: async (ctx, next) => {
        if(ctx.state.token) {
            ctx.status = 302
            ctx.redirect('/photos/all')
        }else{
            await ctx.render('login/login')
        }
    }
}