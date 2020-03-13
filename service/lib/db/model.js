const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    openId: {
        type: String,
        index: true,
        unique: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    name: {
        type: String,
        index: true
    },
    avatar: {
        type: String
    },
    userType: {
        type: Number,
        default: 0
    }
})

const codeSchema = new mongoose.Schema({
    code: {
        type: String
    },
    sessionKey: String
})

module.exports = {
    User: mongoose.model('User', userSchema),
    Code: mongoose.model('Code', codeSchema)
}