const {
    User
} = require('./model');
const {
    encode,
    decode
} = require('../crypto');
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
        await User.update({
            _id: id
        }, {
            lastLogin: Date.now()
        });
        return {
            sessionKey
        }
    },
    async findBySessionKey(sessionKey) {
        const {
            id,
            timespan
        } = decode(sessionKey);
        if (Date.now() - timespan > 1000 * 60 * 60 * 24 * 3) return null;
        const users = await User.find({
            _id: id
        });
        if (users.length) {
            return users[0];
        }
        return null;
    },
    async getUsersCount() {
        return User.count();
    },
    async getUsersByDb(pageIndex, pageSize) {
        return User.find().skip((pageIndex - 1) * pageSize).limit(pageSize)
    },
    async updateUserType(id, userType) {
        return User.update({
            _id: id
        }, {
            userType: type
        });
    },
    async update(id, data) {
        return User.update({
            _id:id
        },data)
    },
    async getUsersCountByType(type){
        return User.count({
            userType:type
        })
    }
}