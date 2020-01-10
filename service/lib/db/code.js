const {
    Code
} = require('./model');

module.exports = {
    async add(code) {
        return Code.create({
            code: code
        });
    },
    async removeData(code) {
        return Code.deleteMany({
            code: code
        });
    },
    async updateSessionKey(code, sessionKey) {
        return Code.update({
            code: code
        }, {
            sessionKey: sessionKey
        })
    }
}