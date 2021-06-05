const httpStatus = require('http-status');
const logger = require('../../config/logger.config');
const UserModel = require('../models/user.model');

// Create a new user.
exports.create = async (req, res, next) => {
    try {
        const userModel = await new UserModel(req.body).save();
        const userModelTransform = userModel.transform();
        res.status(httpStatus.CREATED);
        res.json(userModelTransform);
    } catch (error) {
        logger.error(error.stack || error);
        next(UserModel.checkDuplicateEmail(error));
    }
    return res;
};