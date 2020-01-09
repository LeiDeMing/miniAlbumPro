const {
    getSession
} = require('../lib/wx');

module.exports = {
    async login(code) {
        const session = await getSession(code);
        if (session) {
            const {
                openId
            } = session;
            return login(openId);
        }else{
            throw new Error('登录失败!');
        }
    }
}