const httpStatus = require('http-status');
const moment = require('moment-timezone');
const { omit } = require('lodash');
const logger = require('../../config/logger.config');
const { jwtExpirationInterval } = require('../../config/vars.config');
const UserModel = require('../models/user.model');
const RefreshTokenModel = require('../models/refreshToken.model');

const tokenType = 'Bearer';

// Returns a formated object with tokens.
const generateTokenResponse = async (user, accessToken) => {
    const refreshTokenModel = await RefreshTokenModel.generate(user).token;
    const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
    return { tokenType, accessToken, refreshTokenModel, expiresIn };
};

// Returns jwt token if registration was successful.
module.exports.register = async (req, res, next) => {
    try {
        const userData = omit(req.body, 'role');
        const userModel = await new UserModel(userData).save();
        const userModelTransform = userModel.transform();
        const token = await generateTokenResponse(userModel, UserModel.token());
        res.status(httpStatus.CREATED);
        res.json({ token, user: userModelTransform });
    } catch (error) {
        logger.error(error.stack || error);
        return next(UserModel.checkDuplicateEmail(error));
    }
    return res;
};