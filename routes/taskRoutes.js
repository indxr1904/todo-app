const express = require("express");
const protect = require("../middleware/auth");
const taskController = require("./../controller/taskController");

const router = express.Router();

router.post("/teams/:teamId/tasks", protect, taskController.createTask);
router.get("/teams/:teamId/tasks", protect, taskController.getTask);
router.put("/tasks/:taskId", protect, taskController.updateTask);
router.get("/tasks/:taskId", protect, taskController.deleteTask);
router.patch("tasks/:taskId/move", protect, taskController.moveTask);
router.get("/tasks/:taskId/assign", protect, taskController.assignTask);
router.get("/tasks/:taskId/comments", protect, taskController.addComment);

module.exports = router;
