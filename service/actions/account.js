const {
    login
} = require('../lib/db/user')
const {
    add,
    removeCode,
    updateSessionKey,
    getSessionKey
} = require('../lib/db/code')
const {
    getSession
} = require('../lib/wx')
const {
    decode,
    encodeErCode
} = require('../lib/crypto')
const { ercodeTime } = require('../config')
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
        }, ercodeTime)
        return code
    },
    async setSessionKeyForCode(code, sessionKey) {
        const { timespan } = decode(code)
        if (Date.now() - timespan > ercodeTime) {
            throw new Error('time out')
        }
        await updateSessionKey(code, sessionKey)
    },
    async getSessionKeyByCode(code) {
        const sessionKey = await getSessionKey(code)
        if (sessionKey) {
            await removeCode(code)
        }
        return sessionKey
    }
}