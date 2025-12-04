const Joi = require("joi");

const loginValidation = (user) => {
  const schema = Joi.object({
    email: Joi.string()
      .regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
      .message("Email must be a valid address")
      .required(),

    password: Joi.string()
      .min(6)
      .message("Password must be at least 6 characters long")
      .required(),
  });

  return schema.validate(user);
};

module.exports = loginValidation;
