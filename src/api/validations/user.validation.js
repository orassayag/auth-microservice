const Joi = require('joi');
const UserModel = require('../models/user.model');

module.exports = {
    // POST: /users/create
    createUser: {
        body: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).max(40).required(),
            name: Joi.string().min(2).max(128),
            role: Joi.string().valid(...UserModel.roles)
        })
    }
};