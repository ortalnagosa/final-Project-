const chalk = require("chalk");

const handleError = (res, status, message = "") => {
  console.error(chalk.red(message));
  return res.status(status).json({ success: false, message });
};

const handleBadRequest = async (validator, error) => {
  errorMessage = new Error(`${validator}: ${error.message}`);
  const message = errorMessage.message;
  const status = error.status || 400;
  return Promise.reject({ message, status });
};

const handleJoiError = async (error) => {
  const joiError = error.details[0].message;
  return handleBadRequest("Joi", { message: joiError });
};

exports.handleError = handleError;
exports.handleBadRequest = handleBadRequest;
exports.handleJoiError = handleJoiError;
