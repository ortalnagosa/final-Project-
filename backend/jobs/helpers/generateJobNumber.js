const Job = require("../models/mongodb/Job");
const _ = require("lodash");
const { handleBadRequest } = require("../../utils/errorHandler");

const generateJobNumber = async () => {
  try {
    const random = _.random(1000000, 9000000);
    const job = await Job.findOne({ jobNumber: random });
    if (job) {
      return generateJobNumber();
    }
    return random;
  } catch (error) {
    error.status = 400;
    return handleBadRequest("generateJobNumber", error);
  }
};

module.exports = generateJobNumber;
