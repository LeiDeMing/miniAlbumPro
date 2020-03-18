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

const albumSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    name: {
        type: String
    }
}, {
    versionKey: false,
    timestamps: { createdAt: 'created', updatedAt: 'updated' }
})

const photoSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    url: {
        type: String
    },
    isApproved: {
        type: Boolean,
        default: null,
        index: true
    },
    ablumId: {
        type: mongoose.Schema.Type.ObjectId
    },
    created: {
        type: Date,
        default: Date.now
    },
    isDelete: {
        type: Boolean,
        default: false
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
    Code: mongoose.model('Code', codeSchema),
    Album: mongoose.model('Album', albumSchema)
}