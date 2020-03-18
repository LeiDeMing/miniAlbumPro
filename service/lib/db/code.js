const {
    Code
} = require('./model')

module.exports = {
    async add(code) {
        return Code.create({
            code
        })
    },
    async removeCode(code) {
        return Code.deleteMany({
            code
        })
    },
    async updateSessionKey(code, sessionKey) {
        return Code.update({
            code
        }, {
            sessionKey
        })
    }
}