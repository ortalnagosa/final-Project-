import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
    .required()
    .messages({
      "string.empty": "שדה מייל חובה",
      "string.pattern.base": "כתובת המייל אינה תקינה",
    }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "שדה סיסמה חובה",
    "string.min": "סיסמה חייבת להכיל לפחות 6 תווים",
  }),
});
