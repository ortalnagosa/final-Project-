const jobCreateValidation = require("./joi/createValidation");
const jobUpdateValidation = require("./joi/updateValidation");

const validator = "Joi";

const validateCreateJob = (job) => {
  if (validator === "Joi") {
    return jobCreateValidation(job);
  }
};

const validateUpdateJob = (job) => {
  if (validator === "Joi") {
    return jobUpdateValidation(job);
  }
};



module.exports = { validateCreateJob, validateUpdateJob };
