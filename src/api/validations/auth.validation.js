const Joi = require('joi');

module.exports = {
    // POST: /auth/register
    register: {
        body: Joi.object({
            name: Joi.string().min(2).max(128),
            email: Joi.string().email().required(),
            password: Joi.string().min(8).max(40).required()
        })
    }
};