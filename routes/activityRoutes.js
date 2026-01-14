const express = require("express");
const protect = require("../middleware/auth");

const { activityLimiter } = require("../middleware/rateLimiter");
const { getActivities } = require("../controller/activityController");

const router = express.Router();

router.get("/", protect, activityLimiter, getActivities);

module.exports = router;
