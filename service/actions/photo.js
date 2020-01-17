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
        if(!albums) return []
        return Promise.all(albums.map(async function (item) {
            const id = item._id;
            let ps = await photo.getPhotosByAlbumId(id);
            return Object.assign({
                photoCount: ps.length,
                fm: ps[0] ? ps[0].url : null
            }, item.toObject())
            /* 在扩展相册信息时，获取到的每 个相册都是包装过的 Mongoose 数据实体对象
            在这个对象上又添加了一些额外的数据。如果想得到干净的业务数据，需要采用 toObject 方法将其转换为 JSON 数据格式 */
        }))
    },
    async getPhotoById(id) {
        return photo.getPhotoById(id);
    },
    async delete(id) {
        return photo.delete(id);
    },
    async getPhotosByApproveState(type, pageIndex, pageSize) {
        switch (type) {
            case 'pending':
                const [count, photos] = await Promise.all([photo.getApprovingPhotosCount(), photo.getApprovingPhotos(pageIndex, pageSize)]);
                break
            case 'accepted':
                const [count, photos] = await Promise.all([photo.getApprovedPhotosCount(), photo.getApprovedPhotos(pageIndex, pageSize)]);
                return {
                    count,
                    data: photos
                }
                case 'reject':
                    const [count, photos] = await Promise.all([photo.getUnApprovedPhotosCount(), photo.getUnApprovedPhotos(pageIndex, pageSize)])
        }
    },
    async approve(id, state) {
        photo.approve(id, state);
    }
}