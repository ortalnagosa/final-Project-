const data = require("./initialData.json");
const normalizeUser = require("../users/helpers/normalizeUser");
const normalizeJob = require("../jobs/helpers/normalizeJob");
const { register } = require("../users/models/usersDataService");
const { create } = require("../jobs/models/jobsDataService");
const { generateUserPassword } = require("../users/helpers/bcrypt");
const Job = require("../jobs/models/mongodb/Job");
const User = require("../users/models/mongodb/User");
const chalk = require("chalk");

const generateInitialUsers = async () => {
  const { users } = data;
  for (const userData of users) {
    try {
      let user = await normalizeUser(userData);
      user.password = generateUserPassword(user.password);
      await register(user);
    } catch (error) {
      if (error.message.includes("User already registered")) {
        console.log(`User ${userData.email} already exists, skipping.`);
      } else {
        console.log(chalk.redBright(error.message));
      }
    }
  }
};

const generateInitialJobs = async () => {
  const { jobs } = data;
  const employer = await User.findOne({ role: "employer" });
  jobs.user_id = employer ? employer._id : null;
  if (!employer) {
    console.log(
      chalk.redBright("No employer user found! Cannot assign user_id to jobs.")
    );
    return;
  }
  for (const jobData of jobs) {
    try {
       const existingJob = await Job.findOne({ title: jobData.title });
      if (!existingJob) {
        const normalizedJob = await normalizeJob(jobData, employer._id);
        await create(normalizedJob);
      } else {
        console.log(`Job ${jobData.title} already exists, skipping.`);
      }
    } catch (error) {
      console.log(chalk.redBright(error.message));
    }
  }
}; 
      


module.exports = {  generateInitialUsers, generateInitialJobs };
  