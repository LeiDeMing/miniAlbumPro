const {
    login,
    update,
    getUsersCountByType,
    getUsersByType,
    getUsers,
    getUsersCount
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
    },
    async getUsersByType(type, pageIndex, pageSize) {
        let userType, count, users
        switch (type) {
            case 'admin':
                userType = 1
                break
            case 'blocked':
                userType = -1
                break
            case 'ordinary':
                userType = 0
                break
            case 'all':
                userType = 2
                break
        }
        if (userType !== undefined) {
            [count, users] = await Promise.all([getUsersCountByType(userType), getUsersByType(userType, pageIndex, pageSize)])
        } else {
            [count, users] = await Promise.all([getUsersCount(), getUsers(pageIndex, pageSize)])
        }
    },
    async update(id, data) {
        return update(id, data)
    }
}