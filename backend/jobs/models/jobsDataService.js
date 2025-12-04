const Job = require("./mongodb/Job");
const { handleBadRequest } = require("../../utils/errorHandler");
const config = require("config");
const db = config.get("DB");

const create = async (normalizedJob) => {
  if (db === "MONGODB") {
    try {
      let job = new Job(normalizedJob);
      job = await job.save();
      return job;
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("Job created not in MongoDB");
};
  
const update = async (jobId, normalizedJob) => {
  if (db === "MONGODB") {
    try {
      const job = await Job.findByIdAndUpdate(jobId, normalizedJob, {
        new: true,
      });
      if (!job)
        throw new Error(
          "Could not update this job because a job with this ID cannot be found"
        );
      return job;
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("Job updated not in MongoDB");
};

const find = async () => {
  if (db === "MONGODB") {
    try {
      const jobs = await Job.find();
      return jobs;
    } catch (error) {
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve([]);
};

const findMyJob = async (userId) => {
  if (db === "MONGODB") {
    try {
      const jobs = await Job.find({ user_id: userId });
      return jobs;
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve([]);
};

const findOne = async (jobId) => {
  if (db === "MONGODB") {
    try {
      const job = await Job.findById(jobId);
      // if (!job) throw new Error("Could not find this job in the database");
      return job;
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve({});
};

const remove = async (jobId) => {
  if (db === "MONGODB") {
    try {
      const job = await Job.findByIdAndDelete(jobId);
      if (!job)
        throw new Error(
          "Could not delete this job because a job with this ID cannot be found"
        );
      return job;
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("Job deleted not in MongoDB");
};


const like = async (jobId, userId) => {
  if (db === "MONGODB") {
    try {
      const job = await Job.findById(jobId);
      if (!job)
        throw new Error(
          "Could not change job likes because a job with this ID cannot be found in the database"
        );

      if (!job.likes.includes(userId)) {
        job.likes.push(userId);
      } else {
        job.likes = job.likes.filter(
          (id) => id.toString() !== userId.toString()
        );
      }

      await job.save();
      return job;
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("job updated!");
};

const findJobs = async (filter = {}) => {
  if (db === "MONGODB") {
    try {
      return await Job.find(filter);
    } catch (error) {
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve([]);
};

const findJobParticipants = async (jobId) => {
  if (db === "MONGODB") {
    try {
      const job = await Job.findById(jobId).populate(
        "applicants.user_id",
        "name email phone image resume"
      );
      if (!job) throw new Error("Job not found");
      return job;
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve({});
};

const findJobsAppliedByUser = async (userId) => {
  if (db === "MONGODB") {
    try {
      const jobs = await Job.find({ "applicants.user_id": userId });
      return jobs;
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve([]);
};


module.exports = {
  find,
  findOne,
  create,
  update,
  like,
  remove,
  findMyJob,
  findJobs,
  findJobParticipants,
  findJobsAppliedByUser,
};
