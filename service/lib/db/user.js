const {
    User
} = require('./model');

const getByOpenId = async (openId) => {
    const users = await User.find({
        openId: openId
    });
    if (users.length) return users[0];
    return null;
}

module.exports = {
    async login(openId) {
        let user = await getByOpenId(openId);
        if (!user) {
            user = await User.create({
                openId: openId
            });
        }
        const id = user._id;
        const sessionKey = encode(id);
    }
}