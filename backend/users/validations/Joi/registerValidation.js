// validations/userValidationService.js
const Joi = require("joi");

const urlRegex =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

const imageSchema = Joi.object({
  url: Joi.string().regex(urlRegex).allow("").messages({
    "string.pattern.base": "Image URL must be valid",
  }),
  alt: Joi.string().min(2).max(256).allow(""),
});

const validateRegistration = (user) => {
  const schema = Joi.object({
    name: Joi.object({
      first: Joi.string().min(2).max(256).required(),
      middle: Joi.string().min(2).max(256).allow(""),
      last: Joi.string().min(2).max(256).required(),
    }).required(),

    email: Joi.string()
      .regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
      .required()
      .messages({ "string.pattern.base": "Email must be valid" }),

    password: Joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 6 chars, include uppercase, lowercase, number and special character",
      }),

    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Passwords do not match" }),

    phone: Joi.string()
      .regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
      .required()
      .messages({
        "string.pattern.base": "Phone must be valid Israeli number",
      }),
   experience: Joi.array().items(
  Joi.object({
    title: Joi.string().min(2).max(256).required(),
    company: Joi.string().min(2).max(256).required(),
    from: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({ "string.pattern.base": "Start date must be YYYY-MM-DD" }),
    to: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional().allow("").messages({ "string.pattern.base": "End date must be YYYY-MM-DD" }),
    description: Joi.string().max(1000).optional().allow(""),
  })
).optional(),

    age: Joi.number().min(0).optional(),

    image: imageSchema.optional(),
    city: Joi.string().min(2).max(100).optional(),
    birthDate: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .messages({ "string.pattern.base": "Birthday must be YYYY-MM-DD" }),

    armyUnit: Joi.string().optional(),
    releaseDate: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    about: Joi.string().max(1024).optional(),
    skills: Joi.array().items(Joi.string()).optional(),
  });

  return schema.validate(user);
};

module.exports = validateRegistration;
