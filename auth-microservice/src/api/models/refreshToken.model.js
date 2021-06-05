const mongoose = require('mongoose');
const randomBytes = require('randombytes');
const moment = require('moment-timezone');

// SCHEMA

const refreshTokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        ref: 'User',
        required: true
    },
    expires: {
        type: Date
    }
});

// STATICS

refreshTokenSchema.static({
    // Generate a refresh token object and saves it into the MongoDB.
    async generate(user) {
        const userId = user._id;
        const userEmail = user.email;
        const token = `${userId}.${randomBytes(40).toString('hex')}`;
        const expires = moment().add(30, 'days').toDate();
        const refreshTokenModel = await new RefreshTokenModel({
            token, userId, userEmail, expires
        }).save();
        return refreshTokenModel;
    }
});

const RefreshTokenModel = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = RefreshTokenModel;