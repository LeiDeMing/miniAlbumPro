const axios = require('axios');
const model = require('../model/home'),
    config = require('../config/index');

module.exports = {
    getUser: async (ctx, next) => {
        const status = ctx.params.status || 'all'
        const count = 10
        const index = ctx.request.querystring ? ctx.request.query.index : 1
        const res = await axios.get(`${config.apiUrl}/admin/user/${status}?pageIndex=${index}&pageSize=${count}`, {
            headers: {
                'x-session': ctx.state.token
            }
        })

        await ctx.render('home/users', {
            menu: model.getMenu(),
            activeMenu: 1,
            users: res.data.data.data || [],
            page: Math.ceil(res.data.data.count / count),
            index: parseInt(index),
            status: status
        })
    },
    editUsers: async (ctx, next) => {
        const _type = ctx.request.querystring ? ctx.request.query.type : 0
        const res = await axios.put(`${config.apiUrl}/admin/user/${ctx.params.id}`, {
            userType: _type
        }, {
            headers: {
                'x-session': ctx.state.token
            }
        })
        ctx.body = res.data
    }
}