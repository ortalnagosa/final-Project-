import Joi from "joi";

const urlRegex =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

export const registerSchema = Joi.object({
  name: Joi.object({
    first: Joi.string().min(2).max(256).required().messages({
      "string.empty": "שם פרטי חובה",
    }),
    middle: Joi.string().min(2).max(256).allow(""),
    last: Joi.string().min(2).max(256).required().messages({
      "string.empty": "שם משפחה חובה",
    }),
  }).required(),

  email: Joi.string()
    .pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
    .required()
    .messages({
      "string.empty": "שדה מייל חובה",
      "string.pattern.base": "המייל לא תקין",
    }),

  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/)
    .required()
    .messages({
      "string.empty": "שדה סיסמה חובה",
      "string.pattern.base":
        "הסיסמה חייבת להכיל לפחות 6 תווים, אות גדולה, אות קטנה, מספר ותו מיוחד",
    }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "הסיסמאות אינן תואמות",
    "string.empty": "נא לאשר את הסיסמה",
  }),

  phone: Joi.string()
    .pattern(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
    .required()
    .messages({
      "string.empty": "מספר טלפון חובה",
      "string.pattern.base": "מספר הטלפון לא תקין",
    }),

  image: Joi.object({
    url: Joi.string().pattern(urlRegex).allow("").messages({
      "string.pattern.base": "קישור תמונה לא תקין",
    }),
    alt: Joi.string().min(2).max(256).allow(""),
  }),
  age: Joi.number().min(0).max(120).messages({
    "number.base": "גיל חייב להיות מספר",
    "number.min": "גיל חייב להיות לפחות 0",
    "number.max": "גיל לא יכול להיות מעל 120",
  }),
  city: Joi.string().min(2).max(100).allow(""),

  birthDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "תאריך לידה חייב להיות בפורמט YYYY-MM-DD",
      "string.empty": "שדה תאריך לידה חובה",
    }),
  experience : Joi.array().items(
    Joi.object({
      title: Joi.string().min(2).max(256).required(),
       company: Joi.string().min(2).max(256).required(),
       from: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
      to: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).allow(""), 
      description: Joi.string().max(1000).allow(""),
    })
  ).optional(),

  armyUnit: Joi.string().optional(),
    about: Joi.string().max(1000).optional(),
  releaseDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  skills: Joi.array().items(Joi.string()).optional(),
});
