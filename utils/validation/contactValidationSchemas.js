const Joi = require("joi");

const createContactValidationSchema = Joi.object({
  "name": Joi.string().min(3).max(30).required().messages({
    'any.required': `Missing required name field`,
  }),
  "email": Joi.string().min(3).max(30).required().messages({
    'any.required': 'Missing required email field',
    
  }),
  "phone": Joi.string().min(3).max(30).required().messages({
    'any.required': `Missing required phone field`,
  }),
});

const updateContactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().min(3).max(30),
  phone: Joi.string().min(3).max(30)
}).or("name", "email", "phone");

module.exports = {
  createContactValidationSchema,
  updateContactValidationSchema,
};