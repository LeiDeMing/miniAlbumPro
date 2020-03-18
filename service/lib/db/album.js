const { Album } = require('./model')

module.exports = {
    async add(userId, name) {
        return Album.create({
            userId,
            name
        })
    },
    async update(id, name) {
        return Album.update({

        }, {
            name
        })
    },
    async findById(id) {
        return Album.findById(id)
    },
    async delete(id) {
        return Album.deleteOne({
            _id: id
        })
    },
    async getAlbums(userId, pageIndex, pageSize) {
        let result
        if (pageSize) {
            result = await Album.find({
                userId
            }).skip((pageIndex - 1) * pageSize).limit(pageSize)
        } else {
            result = await Album.find({
                userId
            }).sort({
                'updated': -1
            })
        }
        return result
    },
    async getAlbumsCount(userId) {
        return Album.count({
            userId
        })
    }
}