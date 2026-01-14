const Activity = require("../models/Activity");

exports.getActivities = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const activities = await Activity.find()
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("userId", "email")
    .populate("taskId", "title");

  res.json(activities);
};
