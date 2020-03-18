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
        
    }
}