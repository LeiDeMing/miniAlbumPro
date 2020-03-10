const model = require('../model/home');
const axios = require('axios');

module.exports = {
    getUser: async (ctx, next) => {
        const status = ctx.params.status || 'all'
        const count = 10
        const index = ctx.request.querystring ? ctx.request.query.index : 1
        
    }
}