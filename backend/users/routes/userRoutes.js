const express = require("express");
const router = express.Router();
const {registerUser,loginUser,updateUser,getUsers,getUserID,deleteUser} = require("../services/userService");
const { handleError } = require("../../utils/errorHandler");
const { auth } = require("../../auth/authService");
const { requireRole } = require("../../middlewares/roles");
const upload = require("../../middlewares/uploadResume");
const User = require("../models/mongodb/User");
const { comparePassword, generateUserPassword } = require("../helpers/bcrypt");
const { checkAdminOrSelf } = require("../helpers/authCheck");
 

router.post("/register", async (req, res) => {
  try {
   
      const user = await registerUser(req.body);
    user.role = "user";
    user.pendingEmployerRequest = false;
     res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    return handleError(res, 400, error.message);
  }
});

router.post("/contact", (req, res) => {
  const { name, email, message, age } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }

  console.log("New Contact Form:", { name, email, message,age });

  return res.json({ success: true, message: "We received your message!" });
});

router.post("/request-employer", auth,  async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return handleError(res, 404, "User not found");

    if (user.role === "employer")
      return handleError(res, 400, "You are already an employer");

     if (user.pendingEmployerRequest)
       return handleError(res, 400, "Request already sent");

    user.pendingEmployerRequest = true;
    await user.save();

    return res.status(200).json({ success: true, data: { message: "Employer request sent" } });
  } catch (error) {
    return handleError(res, 400, error.message);
  }
});


router.post("/login", async (req, res) => {
  try {
    const user = await loginUser(req.body);
    return res.status(200).json({ success: true, data: {user} });
  } catch (error) {
    return handleError(res, error.status || 400, error.message);
  }
});

router.get("/search", auth, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query parameter is required" });
    }

    let users = [];
    let totalResults = 0;

    if (req.user.role === "admin") {

       users = await User.find({
         $or: [
           { "name.first": { $regex: query, $options: "i" } },
           { "name.last": { $regex: query, $options: "i" } },
           { email: { $regex: query, $options: "i" } },
         ],
       }).select("-password");
       totalResults = users.length;
    } else {

      const user = await User.findOne({
        _id: req.user._id,
        $or: [
          { "name.first": { $regex: query, $options: "i" } },
          { "name.last": { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      }).select("-password");

      if (user) {
        users = [user];
        totalResults = 1;
      }
    }


    return res.status(200).json({
      success: true,
      data: {
        totalResults,
        users,
      },
    });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
});

router.get("/", auth, requireRole(["admin"]), async (req, res) => {
  try {
      
    const users = await getUsers();
    return res.status(200).json({
      count: users.length,data: {users},
    });
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.get("/request-employer", auth, requireRole(["admin"]), async (req, res) => {
  try {
    
    const requests = await User.find({ pendingEmployerRequest: true });
    return res.status(200).json(requests);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    checkAdminOrSelf(req.user, req.params.id);
    const user = await getUserID(req.params.id);
    return res.status(200).json({ success: true, data: {user} });
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
   checkAdminOrSelf(req.user, req.params.id);
    const user = await updateUser(req.params.id, req.body);
    return res.status(200).json({ success: true, data:{ user }});
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.put("/approve-employer/:id", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return handleError(res, 404, "User not found");

    user.role = "employer";
    user.pendingEmployerRequest = false;
    await user.save();

    return res.status(200).json({ success: true, data: { message: "User is now an employer" } });
  } catch (error) {
    return handleError(res, 400, error.message);
  }
});

router.patch("/reject-employer/:userId", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "user"; 
    user.pendingEmployerRequest = false;
    await user.save();

    res.json({ message: "Request rejected successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
     checkAdminOrSelf(req.user, req.params.id);

     const user = await deleteUser(req.params.id);
    return res.status(200).json({ success: true, data: {user }});
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.post("/:id/upload-resume", auth, upload.single("resume"), async (req, res) => {
  try {
      checkAdminOrSelf(req.user, req.params.id);

    if (!req.file) throw { status: 400, message: "No file uploaded" };

const filePath = `uploads/resumes/${req.file.filename}`;
    const user = await updateUser(req.params.id, { resume: filePath });

    if (!user) return handleError(res, 404, "User not found");

    return res.status(200).json({ success: true, data: { message: "Resume uploaded successfully", resumePath: filePath } });

  } catch (error) {
    return handleError(res, 500, error.message);
  }
});

router.get("/:id/resume", auth, async (req, res) => {
  try {
        checkAdminOrSelf(req.user, req.params.id);
    const user = await getUserID(req.params.id); 
    if (!user || !user.resume)
   return res.status(404).json({ message: "No resume uploaded" });

    return res.status(200).json({ success: true, resumePath: user.resume });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


router.put("/:id/change-password", auth, async (req, res) => {
  try {
   checkAdminOrSelf(req.user, req.params.id);

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return handleError(
        res,
        400,
        "Old password and new password are required"
      );
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{9,}$/;
    if (!passwordRegex.test(newPassword)) {
      return handleError(
        res,
        400,
        "New password must be at least 9 characters and include uppercase, lowercase, number, and special character"
      );
    }

    const user = await User.findById(req.params.id);
    if (!user) return handleError(res, 404, "User not found");

    if (!comparePassword(oldPassword, user.password)) {
      return handleError(res, 400, "Old password is incorrect");
    }

    user.password = generateUserPassword(newPassword);
     user.failedLoginAttempts = 0;
     user.lockUntil = null;
    await user.save();

    return res.status(200).json({ success: true, data: { message: "Password updated successfully" } });
  } catch (error) {
    return handleError(res, 500, error.message);
  }
});


module.exports = router;
