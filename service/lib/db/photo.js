const {
    Photo
} = require('./model');

module.exports = {
    async getPhotosByAlbumIdCount(albumId) {
        return Photo.count({
            albumId,
            isApproved: true,
            isDelete: false
        })
    },
    async getPhotoByAlbumId(albumId, pageIndex, pageSize) {
        return await Photo.find({
            albumId,
            isApproved: true,
            ieDeleted: false
        }).sort({
            'updated': -1
        });
    },
    async getPhotoById(id) {
        return Photo.findById(id);
    },
    async delete(id) {
        return Photo.update({
            _id: id
        }, {
            isDelete: true
        })
    },
    async getApprovingPhotos(pageIndex, pageSize) {
        return Photo.find({
            isApproved: null,
            isDelete: false
        }).skip((pageIndex - 1) * pageSize).limit(pageSize);
    },
    async getApprovingPhotosCount() {
        return Photo.count({
            isApproved: null,
            isDelete: false
        })
    }
}