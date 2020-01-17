const {
    Album
} = require('./model');

module.exports = {
    async add(userId, name) {
        let isAlive = await Album.find({userId})
        if(!!isAlive.length){
            return true
        }
        return Album.create({
            userId,
            name
        })
    },
    async update(id, name) {
        return Album.update({
            _id: id
        }, {
            name
        })
    },
    async findById(id) {
        return Album.findById(id)
    },
    async getAlbums(userId, pageIndex, pageSize) {
        let result;
        if (pageSize && pageIndex > 0) {
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
    }
}