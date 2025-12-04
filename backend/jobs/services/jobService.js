const { validateCreateJob, validateUpdateJob } = require("../validations/jobValidationService");
const { create, update, find, findOne,findMyJob,findJobParticipants, remove,like, findJobsAppliedByUser } = require("../models/jobsDataService");
const normalizeJob = require("../helpers/normalizeJob");
const Job = require("../models/mongodb/Job");

// יצירת משרה חדשה
const createJob = async (rawJob) => {
  try {
    const { error } = validateCreateJob(rawJob);
    if (error) throw new Error(error.details[0].message);

    let job = await normalizeJob(rawJob);
    job = await create(job);
    return job;
  } catch (error) {
    return Promise.reject(error);
  }
};

// עדכון משרה קיימת
const updateJob = async (jobId, rawJob) => {
  try {
    const { error } = validateUpdateJob(rawJob);
    if (error) throw new Error(error.details[0].message);

    const updatedJob = await update(jobId, rawJob);
    return updatedJob;
  } catch (error) {
    return Promise.reject(error);
  }
};

// קבלת כל המשרות
const getJobs = async () => {
  try {
    return await find();
  } catch (error) {
    return Promise.reject(error);
  }
};

const getMyJobs = async (userId) => {
  try {
    return await findMyJob(userId);
  } catch (error) {
    return Promise.reject(error);
  }
};

// קבלת משרה לפי ID
const getJobById = async (jobId) => {
  try {
    return await findOne(jobId);
  } catch (error) {
    return Promise.reject(error);
  }
};

// מחיקת משרה
const deleteJob = async (jobId) => {
  try {
    return await remove(jobId);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Toggle Like
const likeJob = async (jobId, userId) => {
  try {
    const job = await like(jobId, userId);
    return job;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getJobParticipants = async (jobId, currentUser) => {
  try {
    const job = await findJobParticipants(jobId);

    // בדיקה שהמעסיק הוא בעל המשרה או admin
    if (
      job.user_id.toString() !== currentUser._id.toString() &&
      currentUser.role !== "admin"
    ) {
      throw new Error("Not authorized");
    }

    return {
      likes: job.likes,
      applicants: job.applicants,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};

// מחיקת מועמד
const deleteApplicant = async (req, res) => {
  try {
    const { id, applicantId } = req.params;
    const { _id, role } = req.user;
    const job = await getJobById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.user_id.toString() !== _id && role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only the job creator can delete applicants!" });
    }
    job.applicants = job.applicants.filter(
      (applicant) => applicant.user_id.toString() !== applicantId
    );
    await job.save();
    return res.status(200).json({ message: "Applicant deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const getMyAppliedJobs = async (userId) => {
  try {
    const jobs = await findJobsAppliedByUser(userId);
    return jobs.map((job) => {
      const jobObj = job.toObject();
      return {
        ...jobObj,
        likesCount: job.likes.length,
        likedByUser: job.likes.some(
          (id) => id.toString() === userId.toString()
        ),
      };
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  createJob,
  updateJob,
  getJobs,
  getMyJobs,
  getJobById,
  deleteJob,
  likeJob,
  getJobParticipants,
  getMyAppliedJobs,
  deleteApplicant,
};
