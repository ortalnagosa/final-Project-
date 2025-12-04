import Joi from "joi";

const urlRegex =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

export const updateUserSchema = Joi.object({
  name: Joi.object({
    first: Joi.string().min(2).max(50).required().messages({
      "string.empty": "שם פרטי הוא שדה חובה",
      "string.min": "שם פרטי חייב להכיל לפחות 2 תווים",
    }),
    middle: Joi.string().allow("").max(50).messages({
      "string.max": "שם אמצעי יכול להכיל עד 50 תווים",
    }),
    last: Joi.string().min(2).max(50).required().messages({
      "string.empty": "שם משפחה הוא שדה חובה",
      "string.min": "שם משפחה חייב להכיל לפחות 2 תווים",
    }),
  }).required(),

  about: Joi.string().max(500).allow("").messages({
    "string.max": "שדה 'קצת עליי' יכול להכיל עד 500 תווים",
  }),

  city: Joi.string().max(50).allow("").messages({
    "string.max": "שם העיר יכול להכיל עד 50 תווים",
  }),
  age: Joi.number().min(0).max(120).messages({
    "number.base": "גיל חייב להיות מספר",
    "number.min": "גיל חייב להיות לפחות 0",
    "number.max": "גיל לא יכול להיות מעל 120",
  }),
  phone: Joi.string()
    .pattern(/^05\d([-]?\d){7}$/)
    .messages({
      "string.pattern.base": "מספר טלפון לא תקין (חייב להיות בפורמט ישראלי)",
    })
    .allow(""),


  skills: Joi.array().items(Joi.string().min(1)).allow(null).messages({
    "array.base": "רשימת המיומנויות אינה תקינה",
  }),

  image: Joi.object({
    url: Joi.string().pattern(urlRegex).allow("").messages({
      "string.pattern.base": "קישור תמונה לא תקין",
    }),
    alt: Joi.string().allow(""),
  }).optional(),
});
