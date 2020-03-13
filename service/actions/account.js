const {
    login
} = require('../lib/db/user')
const {
    add,
    removeCode
} = require('../lib/db/code')
const {
    getSession
} = require('../lib/wx')
const {
    encodeErCode
} = require('../lib/crypto')
module.exports = {
    async login(code) {
        const session = await getSession(code)
        if (session) {
            const {
                openid
            } = session
            return login(openid)
        } else {
            throw new Error('登陆失败')
        }
    },
    async getErCode() {
        const code = encodeErCode()
        await add(code)
        setTimeout(() => {
            removeCode(code)
        }, 30000)
        return code
    }
}