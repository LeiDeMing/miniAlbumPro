const {
    Photo
} = require('./model');
const ObjectId = require('mongodb').ObjectID

module.exports = {
    async getAllCount() {
        return Photo.find({
            isDeleted:false
        })
    },
    async getAll(pageIndex, pageSize) {
        return Photo.find({
            isDeleted:false
        }).skip((pageIndex-1)*pageSize).limit(pageSize)
    },
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
                isDeleted: false
            }).sort({
                'created': -1
            }).skip((pageIndex - 1) * pageSize).limit(pageSize);
        } else {
            result = Photo.find({
                userId,
                albumId,
                isApproved: true,
                isDeleted: false
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
            isDeleted: false
        })
    },
    async getPhotosByAlbumIdCount(albumId) {
        return Photo.count({
            albumId,
            isApproved: true,
            isDeleted: false
        })
    },
    async getPhotosByAlbumId(albumId, pageIndex, pageSize) {
        return await Photo.find({
            albumId:ObjectId(albumId),
            isApproved: true,
            isDeleted: false
        }).sort({
            'created': -1
        });
    },
    async getPhotoById(id) {
        return Photo.findById(id);
    },
    async delete(id) {
        return Photo.update({
            _id: id
        }, {
            isDeleted: true
        })
    },
    async getApprovingPhotos(pageIndex, pageSize) {
        return Photo.find({
            isApproved: null,
            isDeleted: false
        }).skip((pageIndex - 1) * pageSize).limit(pageSize);
    },
    async getApprovingPhotosCount() {
        return Photo.count({
            isApproved: null,
            isDeleted: false
        })
    },
    async getApprovedPhotosCount() {
        return Photo.find({
            isApproved: true,
            isDeleted: false
        })
    },
    async getApprovedPhotos(pageIndex, pageSize) {
        return Photo.find({
            isApproved: true,
            isDeleted: false
        }).skip((pageIndex - 1) * pageSize).limit(pageSize);
    },
    async getUnApprovedPhotosCount() {
        return Photo.find({
            isApproved: false,
            isDeleted: false
        })
    },
    async getUnApprovedPhotos(pageIndex, pageSize) {
        return Photo.find({
            isApproved: false,
            isDeleted: false
        }).skip((pageIndex - 1) * pageSize).limit(pageSize);
    },
    async update(id,data){
        return Photo.update({
            _id:id
        },data)
    },

    
    async approve(id, state) {
        return Photo.update({
            _id: id
        }, {
            isApproved: state || true
        })
    },
}