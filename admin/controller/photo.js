const axios = require('axios')
const model = require('../model/home')
const config = require('../config')

module.exports = {
    getPhotos: async (ctx, next) => {
        const status = ctx.params.status || 'all'
        const count = 12
        const index = ctx.request.querystring ? ctx.request.query.index : 1
        const column = ctx.request.querystring ? ctx.request.query.column : 3
        const res = await axios.get(`${config.apiUrl}/admin/photo/${status}?pageIndex=${index}&pageSize=${count}`, {
            headers: {
                'x-session': ctx.state.token ? ctx.state.token : ''
            }
        })
        await ctx.render('home/photos', {
            menu: model.getMenu(),
            activeMenu: 0,
            photos: res.data.data.data || [],
            column,
            index: parseInt(index),
            status
        })

    },
    editPhotos: async (ctx, next) => {
        const isApproved = ctx.request.body.type === 0 ? null : (ctx.request.body.type === 1)
        const res = await axios.put(`${config.apiUrl}/admin/photo/${ctx.params.id}`, {
            isApproved
        }, {
            headers: {
                'x-session': ctx.state.token
            }
        })
        console.log(res)
    }
}