const httpStatus = require('http-status');
const passport = require('passport');
const logger = require('../../config/logger.config');
const UserModel = require('../models/user.model');
const APIErrorUtils = require('../utils/APIError.utils');

const ADMIN = 'admin';
const LOGGED_USER = '_loggedUser';

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
    const error = err || info;
    const login = Promise.promisify(req.logIn);
    const apiError = new APIErrorUtils({
        message: error ? error.message : 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
        stack: error ? error.stack : undefined
    });

    // Try to login.
    try {
        if (error || !user) {
            throw error;
        }
        await login(user, { session: false });
    } catch (e) {
        logger.error(e.stack || e);
        return next(apiError);
    }

    // Validated logged in user.
    if (roles === LOGGED_USER) {
        if (err && !user) {
            return next(apiError);
        }
        if ((user.role !== ADMIN && req.params.userId !== user._id.toString())
            || (!roles.includes(user.role))) {
            apiError.message = 'Forbidden';
            apiError.status = httpStatus.FORBIDDEN;
            return next(apiError);
        }
    }
    req.user = user;
    return next();
};

module.exports.ADMIN = ADMIN;
module.exports.LOGGED_USER = LOGGED_USER;

module.exports.authorize = (roles = UserModel.roles) => (req, res, next) => {
    const authenticate = passport.authenticate('jwt', { session: false }, handleJWT(req, res, next, roles));
    return authenticate(req, res, next);
};