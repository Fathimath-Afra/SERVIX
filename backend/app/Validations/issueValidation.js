const Joi = require("joi");

const createIssueValidation = Joi.object({
  title: Joi.string().min(3).required(),

  description: Joi.string().min(10).required(),

  category: Joi.string()
    .valid("water", "electricity", "waste", "other")
    .required(),

  images: Joi.array()
    .items(Joi.string().uri())
    .max(3)              // limit number of images
    .optional()
});


const updateIssueValidation = Joi.object({
  title: Joi.string().min(3),

  description: Joi.string().min(10),

  category: Joi.string().valid(
    "water",
    "electricity",
    "waste",
    "other"
  ),

  status: Joi.string().valid(
    "open",
    "in-progress",
    "resolved"
  ),

  images: Joi.array()
    .items(Joi.string().uri())
    .max(5)
});


module.exports = {
  createIssueValidation,
  updateIssueValidation
};
