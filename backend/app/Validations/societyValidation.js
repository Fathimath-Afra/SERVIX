const Joi = require("joi");

const societyValidation = Joi.object({
  name: Joi.string().min(3).required(),
  address: Joi.string().min(5).required(),
  city: Joi.string().min(3).required(),
});

module.exports = societyValidation;
