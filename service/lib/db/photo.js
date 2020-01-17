const {
    Photo
} = require('./model');

module.exports = {
    async add(userId, url, albumId) {
        let _photo = await Photo.create({
            userId,
            url,
            albumId
        })
        return _photo
    },
    async getPhotos(userId, albumId, pageIndex, pageSize) {
        let result;
        if (pageSize) {
            result = await Photo.find({
                userId,
                albumId,
                isApproved: true,
                isDelete: false
            }).sort({
                'created': -1
            }).skip((pageIndex - 1) * pageSize).limit(pageSize);
        } else {
            result = Photo.find({
                userId,
                albumId,
                isApproved: true,
                isDelete: false
            }).sort({
                'created': -1
            });
        }
        return result;
    },
    async getPhotosCount(userId, albumId) {
        return Photo.count({
            userId,
            albumId,
            isApproved: true,
            isDelete: false
        })
    },
    async getPhotosByAlbumIdCount(albumId) {
        return Photo.count({
            albumId,
            isApproved: true,
            isDelete: false
        })
    },
    async getPhotosByAlbumId(albumId, pageIndex, pageSize) {
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
    },
    async getApprovedPhotosCount() {
        return Photo.find({
            isApproved: true,
            isDelete: false
        })
    },
    async getApprovedPhotos(pageIndex, pageSize) {
        return Photo.find({
            isApproved: true,
            isDelete: false
        }).skip((pageIndex - 1) * pageSize).limit(pageSize);
    },
    async getUnApprovedPhotosCount() {
        return Photo.find({
            isApproved: false,
            isDelete: false
        })
    },
    async getUnApprovedPhotos(pageIndex, pageSize) {
        return Photo.find({
            isApproved: false,
            isDelete: false
        }).skip((pageIndex - 1) * pageSize).limit(pageSize);
    },
    async approve(id, state) {
        return Photo.update({
            _id: id
        }, {
            isApproved: state || true
        })
    }
}