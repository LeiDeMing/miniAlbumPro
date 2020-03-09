const menuData = [{
    title: '照片管理',
    icon: 'image',
    url: '/photos/all'
}, {
    title: '用户管理',
    icon: 'users',
    url: '/usrs/all'
}]

module.exports = {
    getMenu: function () {
        return menuData
    }
}