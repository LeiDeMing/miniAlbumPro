const { Photo } = require('./model')

module.exports = {
    async getPhotosByAlbumIdCount(albumId) {
        return Photo.count({
            albumId,
            isApproved: true,
            isDelete: false
        })
    },
    async getPhotosByAlbumId(albumId, pageIndex, pageSize) {
        let result
        if (pageSize) {
            result = await Photo.find({
                albumId,
                isApproved: true,
                isDelete: false
            }).skip((pageIndex - 1) * pageSize).limit(pageSize)
        } else {
            result = await Photo.find({
                albumId,
                isApproved,
                isDelete
            }).sort({
                'updated': -1
            })
        }
        return result
    },
    async getPhotoById(id) {
        return Photo.findById(id)
    },
    async delete(id) {
        return Photo.update({
            _id: id
        }, {
            isDelete: true
        })
    },
    async getApprovingPhotosCount() {
        return Photo.count({
            isApproved: null,
            isDelete: false
        })
    },
    async getApprovingPhotos(pageIndex, pageSize) {
        return Photo.find({
            isApproved: null,
            isDelete: false
        }).skip((pageIndex - 1) * pageSize).limit(pageSize)
    },
    async getApprovedPhotosCount() {
        return Photo.count({
            isApproved: true,
            isDelete: false
        })
    },
    async getApprovedPhotos(pageIndex, pageSize) {
        return Photo.find({
            isApproved: true,
            isDelete: false
        }).skip((pageIndex - 1) * pageSize).limit(pageSize)
    },
    async getUnApprovedPhotosCount() {
        return Photo.count({
            isApproved: false,
            isDelete: false
        })
    },
    async getUnApprovedPhotos(pageIndex, pageSize) {
        return Photo.find({
            isApproved: false,
            isDelete: false
        }).skip((pageIndex - 1) * pageSize).limit(pageSize)
    }
}