const httpStatus = require('http-status');
const passport = require('passport');
const UserModel = require('../models/user.model');
const APIErrorUtils = require('../utils/APIError.utils');

const ADMIN = 'admin';
const LOGGED_USER = '_loggedUser';

const handleJWT = (req, res, next, roles) => async (err, user, info) => {

};

module.exports.authorize = (roles = UserModel.roles) => (req, res, next) => {
    const authenticate = passport.authenticate('jwt', { session: false }, handleJWT(req, res, next, roles));
    return authenticate(req, res, next);
};