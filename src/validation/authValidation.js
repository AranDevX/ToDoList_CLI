const Joi = require('joi');

// Validation schema for registration
const validateRegister = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('user', 'admin').default('user') // Optional role
    });

    return schema.validate(data);
};

// Validation schema for login
const validateLogin = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
};

module.exports = {
    validateRegister,
    validateLogin
};
