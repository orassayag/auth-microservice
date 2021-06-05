const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jsonwebtoken');
const logger = require('../../config/logger.config');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars.config');
const APIErrorUtils = require('../utils/APIError.utils');

// SCHEMA

// User roles.
const roles = ['user', 'admin'];

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 40
    },
    name: {
        type: String,
        minlength: 2,
        maxlength: 128,
        required: true,
        index: true,
        trim: true
    },
    services: {
        facebook: String,
        google: String
    },
    role: {
        type: String,
        enum: roles,
        default: roles[0]
    },
    picture: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// PRE-SAVE

// Hash rounds
const hashRounds = env === 'development' ? 1 : 10;

// Before saving the user, perform custom validations and hash the password.
userSchema.pre('save', async function save(next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const hash = await bcrypt.hash(this.password, hashRounds);
        this.password = hash;
        return next();
    } catch (error) {
        logger.error(error.stack || error);
        return next(error);
    }
});

// METHODS

// Fields list to be transformed.
const fields = ['id', 'name', 'email', 'picture', 'role', 'createdAt'];

userSchema.method({
    transform() {
        const transformed = {};
        fields.forEach((field) => {
            transformed[field] = this[field];
        });
        return transformed;
    }
});

// STATICS

userSchema.static({
    // User roles.
    roles,

    // Checks for duplicate email addresses in the MongoDB and return appropriate error.
    checkDuplicateEmail(error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return new APIErrorUtils({
                message: 'Validation Error',
                errors: [{
                    field: 'email',
                    location: 'body',
                    messages: ['"email" already exists']
                }],
                status: httpStatus.CONFLICT,
                isPublic: true,
                stack: error.stack
            });
        }
        return error;
    },

    // Creates new a jwt token and return it.
    token() {
        const payload = {
            exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
            iat: moment().unix(),
            sub: this._id
        };
        return jwt.sign(payload, jwtSecret);
    }
});

module.exports = mongoose.model('User', userSchema);