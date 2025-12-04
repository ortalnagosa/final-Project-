import Joi from "joi";

export const createJobSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  subtitle: Joi.string().max(256).allow(""),
  company: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  phone: Joi.string().allow(""),
  email: Joi.string().email({ tlds: false }).allow(""),
web: Joi.string()
  .pattern(
    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+|localhost(:\d+)?)(\/\S*)?$/
  )
  .required(),
  image: Joi.object({
    url: Joi.string().uri().required(),
    alt: Joi.string().required(),
  }),

  address: Joi.object({
    city: Joi.string().required(),
    street: Joi.string().required(),
    houseNumber: Joi.number().required(),
    zip: Joi.number().allow(null),
  }),

  salary: Joi.string().allow(""),
});
