const Joi = require("joi");

const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+|localhost(:\d+)?)(\/\S*)?$/;

const validateCreateJob = (job) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(256).required(),
    subtitle: Joi.string().max(256).allow(""),

    description: Joi.string().min(10).required(),

    company: Joi.string().min(2).max(256).required(),

    web: Joi.string().pattern(urlRegex).allow(""),
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
    image: Joi.object({
      url: Joi.string().pattern(urlRegex).allow(""),
      alt: Joi.string().min(2).max(256).allow(""),
    }).default({}),

    address: Joi.object({
      city: Joi.string().min(2).max(256).required(),
      street: Joi.string().min(2).max(256).required(),
      houseNumber: Joi.number().min(0).default(0),
      zip: Joi.number().min(0).default(0).allow(null),
    }),
    salary: Joi.string().allow("").default("לא צוין"),
    likes: Joi.array().items(Joi.string()).default([]),
    applicants: Joi.array()
      .items(
        Joi.object({
          user_id: Joi.string(),
          submittedAt: Joi.date().default(Date.now),
          status: Joi.string().valid("pending", "contacted").default("pending"),
          name: Joi.object({
                first: Joi.string().min(2).max(256).required(),
                middle: Joi.string().min(2).max(256).allow(""),
                last: Joi.string().min(2).max(256).required(),
              }).required(),
        })
      )
      .default([]),
    user_id: Joi.string().required(),
    status: Joi.string().valid("active", "inactive").default("active"),
  });

  return schema.validate(job, { abortEarly: false });
};

module.exports = validateCreateJob;
