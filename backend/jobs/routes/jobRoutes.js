const express = require("express");
const router = express.Router();
const { handleError } = require("../../utils/errorHandler");
const { auth } = require("../../auth/authService");
const { requireRole } = require("../../middlewares/roles");
const {createJob,updateJob,getJobs,getMyJobs,getJobById,deleteJob,likeJob ,getJobParticipants  ,getMyAppliedJobs} = require("../services/jobService");
const { findJobs } = require("../models/jobsDataService");
const Job = require("../../jobs/models/mongodb/Job");
const User = require("../../users/models/mongodb/User");
const { deleteApplicant } = require("../services/jobService");


// יצירת משרה חדשה (רק admin או employer)
router.post("/create", auth, requireRole(["admin", "employer"]), async (req, res) => {
  console.log("req.user:", req.user);
 try {
   const { _id } = req.user;
   const jobData = { ...req.body, user_id: _id };
   const job = await createJob(jobData);
   return res.status(201).json(job);
 } catch (error) {
   return handleError(res, error.status || 400, error.message);
 }
});

// חיפוש משרות לפי שם, חברה או מיקום
router.get("/search",auth, async (req, res) => {
  try {
    const filter = {};
    
    if (req.query.title) filter.title = { $regex: req.query.title, $options: "i" };
    if (req.query.subtitle)filter.subtitle = { $regex: req.query.subtitle, $options: "i" };
    if (req.query.company)filter.company = { $regex: req.query.company, $options: "i" };
    if (req.query.location)filter["address.city"] = { $regex: req.query.location, $options: "i" };
    

    const jobs = await findJobs(filter);
    const formattedJobs = jobs.map((job) => {
      const jobObj = job.toObject();
      return {
        ...jobObj,
        likesCount: job.likes.length,
        likedByUser: job.likes.some(
          (id) => id.toString() === req.user._id.toString()
        ),
      };
    });
    return res.status(200).json({
      count: formattedJobs.length,
      jobs: formattedJobs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({  message: error.message });
  }
});

// קבלת כל המשרות
router.get("/", async (req, res) => {
  try {
    const jobs = await getJobs();

   const userId = req.user?._id?.toString();

    const formattedJobs = jobs.map(job => {
      const jobObj = job.toObject();

      return {
        ...jobObj,
        likesCount: job.likes,
        likedByUser: userId
          ? job.likes.some(id => id.toString() === userId)
          : false, // אם המשתמש לא מחובר
      };
    });

    return res.status(200).json( formattedJobs );
  } catch (error) {
    return handleError(res, 500, error.message);
  }
});


// קבלת כל המשרות שהמשתמש אהב
router.get("/liked", auth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const jobs = await getJobs();

    const likedJobs = jobs.filter(job =>
      job.likes.some(id => id.toString() === userId)
    );

    const formatted = likedJobs.map(job => ({
      ...job.toObject(),
      likesCount: job.likes.length,
      likedByUser: true, // כי הוא אהב את כולן
    }));

    return res.status(200).json({ data: formatted });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
});


// קבלת המשרות שהמשתמש הנוכחי יצר
router.get("/myJobs", auth, async (req, res) => {
  try {
    const jobs = await getMyJobs(req.user._id);

    const formattedJobs = jobs.map((job) => {
      const jobObj = job.toObject();
      return {
        ...jobObj,
        likesCount: job.likes.length,
        likedByUser: job.likes.some(
          (id) => id.toString() === req.user._id.toString()
        ),
      };
    });

    return res.status(200).json({
      count: formattedJobs.length,
      jobs: formattedJobs,
    });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
});
// קבלת המשרות שהמשתמש הנוכחי הגיש אליהן מועמדות
router.get("/my-applied-jobs", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const jobs = await getMyAppliedJobs(userId);

    return res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// קבלת משתתפי משרה (רק יוצר המשרה או admin)
router.get("/:id/participants", auth, requireRole(["employer", "admin"]), async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate("applicants.user_id", "firstName lastName email image resume") // 👈 פרטים חשובים בלבד
      .populate("likes", "firstName lastName image resume"); // 👈 פרטים חשובים בלבד

    if (!job) return res.status(404).json({ message: "Job not found" });

    return res.status(200).json({
      likesCount: job.likes.length,
      likes: job.likes,
      applicantsCount: job.applicants.length,
      applicants: job.applicants,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


// הגשת מועמדות למשרה (כל משתמש מחובר)
router.post("/:id/apply", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
console.log(job);

    // בדיקה אם כבר שלח פרטים
    const alreadyApplied = job.applicants.some(
      (a) => a.user_id.toString() === userId.toString()
    );
    if (alreadyApplied)
      return res.status(400).json({ message: "Already applied" });
    const user = await User.findById(userId);

    job.applicants.push({
      user_id: userId,
      name: user.name,
      email: user.email,
      phone: user.phone, 
      image: { url: user.image?.url, alt: user.image?.alt},

    });
    await job.save();

    return res.status(200).json(job);
  } catch (error) {
    return res.status(500).json({  message: error.message });
  }
});

// Toggle Like (כל משתמש מחובר)
router.patch("/:id/like", auth, async (req, res) => {
  try {
    const job = await likeJob(req.params.id, req.user._id);
    const jobObj = job.toObject();
    
    return res.status(200).json({
      ...jobObj,
      likesCount: job.likes.length,
      likedByUser: job.likes.some(
        id => id.toString() === req.user._id.toString()
      ),
    });
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

// עדכון משרה (רק יוצר או admin)
router.put("/:id", auth, requireRole(["admin", "employer"]), async (req, res) => {
  try {
     const { id } = req.params;
    const { _id } = req.user;
      const job = await getJobById(id);
    if (!job) {
      return handleError(res, 404, "Job not found");
    }
    if (job.user_id.toString() !== _id && req.user.role !== "admin") {
      return handleError(
        res,
        403,
        "Authorization Error: Only the job creator can updateJob!"
      );
    }
    const updatedJob = await updateJob(id, req.body);
    return res.status(200).json(updatedJob);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});


// מחיקת משרה (רק admin)
router.delete("/:id", auth, requireRole(["admin", "employer"]), async (req, res) => {
  try {
       const { id } = req.params;
       const { _id } = req.user;
    const job = await getJobById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });
     if (job.user_id.toString() !== _id && req.user.role !== "admin") {
       return handleError(
         res,
         403,
         "Authorization Error: Only the job creator can updateJob!"
       );
    }
        const deleteJobId = await deleteJob(id);
    return res.status(200).json(deleteJobId);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

// מחיקת מועמד
router.delete("/:id/applicants/:applicantId", auth, requireRole(["admin", "employer"]), async (req, res) => {
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

    await deleteApplicant(req, res);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});
  


// קבלת משרה לפי ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const job = await getJobById(id);
    return res.send(job);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

module.exports = router;
