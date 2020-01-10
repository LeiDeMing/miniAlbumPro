const mongoose = require('mongoose');

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
        type: Number
    }
})

const codeScheme = mongoose.Scheme({
    code: {
        type: String
    },
    sessionKey: String
})

const albumSchema = mongoose.Scheme({
    userId: {
        type: String
    },
    name: {
        type: String
    }
}, {
    versionKey: false,
    timestamps: {
        createAt: 'created',
        updateAt: 'updated'
    }
})

const photoSchema = mongoose.Schema({
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
    albumId: {
        type: mongoose.Schema.Types.ObjectId //?
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

module.exports = {
    User: mongoose.model('User', userSchema),
    Code: mongoose.model('Code', codeScheme),
    Photo: mongoose.model('Photo', photoSchema),
    Album: mongoose.model('Album', albumSchema)
}