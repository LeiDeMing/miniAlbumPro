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
    },
    async deleteAlbum(id) {
        const photos = await photo.getPhotosByAlbumIdCount(id)
        if (photos) {
            throw new Error('相册还存在相片，不允许删除')
        }
        return album.delete(id)
    },
    async getAlbums(userId, pageIndex, pageSize) {
        let albums, count
        if (pageSize) {
            [albums, count] = await Promise.all([album.getAlbumsCount(userId), album.getAlbums(userId, pageIndex, pageSize)])
        } else {
            ablums = await album.getAlbums(userId)
        }
        let result = await Promise.all(albums.map(async function (item) {
            const id = item._id
            let ps = await photo.getPhotosByAlbumId(id)
            return Object.assign({
                photoCount: ps.length,
                fm: ps[0] ? ps[0].url : null
            }, item.toObject())
        }))
        if (count) {
            return {
                count,
                data: result
            }
        }
    },
    async getPhotoById(id) {
        return photo.getPhotoById(id)
    },
    async delete(id) {
        return photo.delete(id)
    }
}