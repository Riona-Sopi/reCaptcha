const Joi = require("joi");

exports.createValidation = (data) => {
  const schema = Joi.object({
    careerTitle: Joi.string().min(3).required(),
    careerDescription: Joi.string().min(3).required(),
    careerTitle_en: Joi.string().min(3).required(),
    careerDescription_en: Joi.string().min(3).required()
  });

  return schema.validate(data);
};

exports.editValidation = (data) => {
  const schema = Joi.object({
    careerTitle: Joi.string().min(3),
    careerDescription: Joi.string().min(3),
    careerTitle_en: Joi.string().min(3),
    careerDescription_en: Joi.string().min(3)
  });

  return schema.validate(data);
};