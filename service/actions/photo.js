const album = require('../lib/db/album');
const photo = require('../lib/db/photo')
module.exports = {
    async addAlbum(userId, name) {
        return album.add(userId, name)
    },
    async updateAlbum(id, name, user) {
        const _album = await album.findById(id);
        if (!_album) throw new Error('修改的相册不存在');
        if (!user.isAdmin && user.id !== _album.userId) throw new Error('您没有权限修改此相册');
        return album.updata(id, name);
    },
    async deleteAlbum(id) {
        const photos = await photo.getPhotosByAlbumIdCount(id);
        if (photos.length) throw new Error('相册还存在照片，不允许删除');
        return album.delete(id);
    },
    async getAlbums(userId, pageIndex, pageSize) {
        const albums = await album.getAlbums(userId, pageIndex, pageSize);
        return Promise.all(albums.map(async function (item) {
            const id = item._id;
            let ps = await photo.getPhotosByAlbumId(id)
        }))
    }
}