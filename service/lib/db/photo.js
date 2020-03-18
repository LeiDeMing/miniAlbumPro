const { Photo } = require('./model')

module.exports = {
    async getPhotosByAlbumIdCount(albumId) {
        return Photo.count({
            albumId,
            isApproved: true,
            isDelete: false
        })
    }
}