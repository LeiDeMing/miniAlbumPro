const {
    getSession
} = require('../lib/wx');
const {
    encodeErCode,
    decode
} = require('../lib/crypto');
const {
    add,
    removeData,
    getSessionKey,
    updateSessionKey
} = require('../lib/db/code'), {
    getUsersByDb,
    updateUserType,
    login,
    update
} = require('../lib/db/user');
module.exports = {
    async login(code) {
        const session = await getSession(code);
        if (session) {
            const {
                openid: openId
            } = session;
            return login(openId);
        } else {
            throw new Error('登录失败!');
        }
    },
    async getErCode() {
        const code = encodeErCode();
        await add(code);
        setTimeout(() => {
            removeData(code);
        }, 30000);
        return code;
    },
    async setSessionKeyForCode(code, sessionKey) {
        const {
            timespan
        } = decode(code);
        if (Date.now() - timespan > 30000) throw new Error('time out');
        await updateSessionKey(code, sessionKey);
    },
    async getSessionKeyByCode(code) {
        const sessionKey = await getSessionKey(code);
        if (sessionKey) removeData(code);
        return sessionKey;
    },
    async update(id,data){
        return update(id,data)
    },
    async getUsersByType(type,pageIndex,pageSize){
        let userType,count,users
        switch(type){
            case 'admin':
                userType = 1
                break;
            case 'blocked':
                userType = -1
                break
            case 'ordinary':
                userType = 0
                break
        }
        if(userType !== undefined){
            [count,users]
        }
    },


    async getUsers(pageIndex, pageSize) {
        const [conut, users] = await Promise.all([getUsersCount(), getUsersByDb(pageIndex, pageSize)]);
        return {
            count,
            data: users
        }
    },
    async serUserType(id, userType) {
        return updateUserType();
    }
}