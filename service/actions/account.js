const {
    getSession
} = require('../lib/wx');
const {
    encodeErCode,
    decode
} = require('../lib/crypto');
const {
    add,
    removeData
} = require('../lib/db/code');
module.exports = {
    async login(code) {
        const session = await getSession(code);
        if (session) {
            const {
                openId
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
    }
}