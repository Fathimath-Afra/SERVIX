const Joi = require("joi");

// Helper for MongoDB ObjectId validation
// const objectId = Joi.string().hex().length(24);


const createIssueValidation = Joi.object({
  title: Joi.string().min(3).required(),

  description: Joi.string().min(10).required(),

  category: Joi.string()
    .valid("water", "electricity", "waste","plumbing", "other")
    .required(),

  images: Joi.array()
    .items(Joi.string().uri())
    .max(3)              
    .optional(),

  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required()
  }).optional(),

  status: Joi.string()
    .valid("open", "in-progress", "resolved")
    .optional(),

  // societyId: objectId.required(),

  // createdBy: objectId.required(),

  // assignedTo: objectId.allow(null).optional()

});

/*
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
*/

module.exports = {
  createIssueValidation
  
};
