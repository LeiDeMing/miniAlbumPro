const mongoose = require('mongoose');
const {
    dbName,
    dbUser,
    dbPassword
} = require('../../config');
module.exports = {
    dbOpen() {
        return mongoose.connect(dbName, {
            user: dbUser,
            pass: dbPassword,
            poolSize: 10
        })
    },
    dbClose() {
        return mongoose.connection.close()
    }
}