const Joi = require('joi');

// Define schema for user registration
const registerValidation = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'user').optional()  // Optional, defaults to 'user'
});

// Define schema for user login
const loginValidation = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required()
});

module.exports = {
  registerValidation,
  loginValidation
};
