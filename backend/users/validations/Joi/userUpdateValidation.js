const Joi = require("joi");

const urlRegex =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

  const imageSchema = Joi.object({
    url: Joi.string().regex(urlRegex).allow("").messages({
      "string.pattern.base": "Image URL must be valid",
    }),
    alt: Joi.string().min(2).max(256).allow(""),
  });

const updateUserValidation = (user) => {
  const schema = Joi.object({
    name: Joi.object({
      first: Joi.string().min(2).max(256),
      middle: Joi.string().min(2).max(256).allow(""),
      last: Joi.string().min(2).max(256),
    }),

    email: Joi.string()
      .regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
      .message("Email must be a valid address"),

    password: Joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/)
      .message(
        "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character"
      ),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .messages({ "any.only": "Passwords do not match" }),

    phone: Joi.string()
      .regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
      .message("Phone must be a valid Israeli number"),

    image: imageSchema.optional(),
       experience: Joi.array().items(
      Joi.object({
        title: Joi.string().min(2).max(256),
        company: Joi.string().min(2).max(256),
        from: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({ "string.pattern.base": "Start date must be YYYY-MM-DD" }),
        to: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional().allow("").messages({ "string.pattern.base": "End date must be YYYY-MM-DD" }),
        description: Joi.string().max(1000).optional().allow(""),
      })
    ).optional(),
   age: Joi.number().min(0).optional(),
    
    resume: Joi.any().optional().allow(null, ""),
    city: Joi.string().min(2).max(100),
    birthDate: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .messages({
        "string.pattern.base": "תאריך לידה חייב להיות בפורמט YYYY-MM-DD",
        "string.empty": "שדה תאריך לידה חובה",
      }),
    armyUnit: Joi.string(),
    releaseDate:Joi.string()
          .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    about: Joi.string().max(1024).optional(),
    skills: Joi.array().items(Joi.string()).allow("").optional(),
  });

  return schema.validate(user);
};

module.exports = updateUserValidation;
