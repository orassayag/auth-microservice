const httpStatus = require('http-status');
const UserModel = require('../models/user.model');

// Create a new user.
exports.create = async (req, res, next) => {
    try {
        const userModel = new UserModel(req.body);
        const savedUserModel = await userModel.save();
        res.status(httpStatus.CREATED);
        res.json(savedUserModel.transform());
    } catch (error) {
        next(UserModel.checkDuplicateEmail(error));
    }
};