const Joi = require("joi");

const registerValidation = Joi.object({
  name: Joi.string().min(3).required(),

  email: Joi.string().email().required(),

  phone: Joi.string().length(10).optional(),

  password: Joi.string().min(6).required(),

  role: Joi.string().valid("admin", "manager", "citizen", "worker"),
   

  societyId: Joi.string().hex().length(24).optional(),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  registerValidation,
  loginValidation
};
