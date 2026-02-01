const Joi = require("joi");

const societyValidation = Joi.object({
  name: Joi.string().min(3).required(),
  address: Joi.string().min(5).required(),
  city: Joi.string().min(3).required(),
});


const updateSocietyValidation = Joi.object({
  name: Joi.string().min(3).optional(),
  address: Joi.string().min(5).optional(),
  city: Joi.string().min(3).optional(),
}).min(1); 

module.exports ={ societyValidation, updateSocietyValidation};
