const Joi = require("joi");

const jobUpdateValidation = (job) => {
   const urlRegex =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
  
  const schema = Joi.object({
    title: Joi.string().min(2).max(256),
    subtitle: Joi.string().max(256).allow(""),
    description: Joi.string().min(10),
    company: Joi.string().min(2).max(256),
    email: Joi.string()
      .ruleset.regex(
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
      )
      .rule({ message: "Job email must be valid mail" })
      .required(),
    phone: Joi.string()
      .ruleset.regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
      .rule({ message: "Job phone must be valid Israeli phone number" })
      .required(),
    web: Joi.string()
      .ruleset.regex(urlRegex)
      .rule({ message: "Job web address must be valid url" })
      .allow(""),
    image: Joi.object().keys({
      url: Joi.string()
        .ruleset.regex(urlRegex)
        .rule({ message: "image Job url address must be valid url" })
        .allow(""),
      alt: Joi.string().min(2).max(256).allow(""),
    }),
    address: Joi.object({
      city: Joi.string().allow(""),
      street: Joi.string().allow(""),
      houseNumber: Joi.number().allow(null),
      zip: Joi.string().allow(""),
    }),
    status: Joi.string().valid("active", "closed"),
    user_id: Joi.string().allow(""),
  });

  return schema.validate(job, { abortEarly: false });
};

module.exports =  jobUpdateValidation ;
