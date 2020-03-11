const {
    login
} = require('../lib/db/user')
const {
    getSession
} = require('../lib/db/wx')
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
    }
}