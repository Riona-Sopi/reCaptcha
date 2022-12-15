const Joi = require("joi");

exports.createValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    onlineLink: Joi.string().min(3),
    email: Joi.string().min(3).required(),
    address: Joi.string().min(3).required(),
    info: Joi.string().min(3).required(),
    phone: Joi.string().min(3).required(),

    address_en: Joi.string().min(3).required(),
    info_en: Joi.string().min(3).required(),
    onlineLink_en: Joi.string().min(3),

    logo: Joi.string(),
    planimetry: Joi.string(),
  });

  return schema.validate(data);
};

exports.editValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3),
    onlineLink: Joi.string().min(3),
    email: Joi.string().min(3),
    address: Joi.string().min(3),
    info: Joi.string().min(3),

    address_en: Joi.string().min(3),
    info_en: Joi.string().min(3),
    onlineLink_en: Joi.string().min(3),
    
    phone: Joi.string().min(3),
    logo: Joi.string(),
    planimetry: Joi.string(),
  });

  return schema.validate(data);
};