const Joi = require("joi");

exports.createValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    name_en: Joi.string().min(3).required()
  });

  return schema.validate(data);
};

exports.editValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3),
    name_en: Joi.string().min(3)
  });

  return schema.validate(data);
};