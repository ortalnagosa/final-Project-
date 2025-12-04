const express = require("express");
const router = express.Router();
const jobesController = require("../jobs/routes/jobRoutes");
const usersController = require("../users/routes/userRoutes");
const { handleError } = require("../utils/errorHandler");

router.use("/api/jobs", jobesController);
router.use("/api/users", usersController);


router.use((req, res) => handleError(res, 404, "Route not Found!"));

module.exports = router;
