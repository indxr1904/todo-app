const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  action: {
    type: String,
    enum: ["CREATED", "UPDATED", "MOVED", "ASSIGNED"],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Activity", activitySchema);
