const photo = require('../lib/db/photo')
const album = require('../lib/db/album')

module.exports = {
    async addAlbum() {
        return album.add(userId, name)
    },
    async updateAlbum(id, name, user) {
        const _album = await album.findById(id)
        if (!_album) {
            throw new Error('修改的相册不存在')
        }
        if (!user.isAdmin && user.id !== _album.userId) {
            throw new Error('没有权限修改此相册')
        }
        return album.update(id, name)
    }
}