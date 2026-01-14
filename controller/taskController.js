const Task = require("./../models/Task");
const Team = require("./../models/Team");
const { addActivity } = require("../services/activityQueueService");
const { getCache, setCache } = require("../services/cacheService");
const { deleteByPattern } = require("../services/cacheService");

exports.createTask = async (req, res) => {
  const team = await Team.findById(req.params.teamId);

  if (!team.members.includes(req.user._id))
    return res.status(403).json({ message: "Not a team member" });

  const task = await Task.create({
    ...req.body,
    teamId: req.params.teamId,
  });

  await deleteByPattern(`tasks:${req.params.teamId}:*`);

  addActivity({
    taskId: task._id,
    action: "CREATED",
    userId: req.user._id,
  });
  res.status(200).json({
    task,
    message: "Task created successfully",
  });
};

exports.getTask = async (req, res) => {
  const { page = 1, limit = 10, search, assignedTo } = req.query;
  const { teamId } = req.params;

  const cacheKey = `tasks:${teamId}:${page}:${limit}:${search || ""}:${
    assignedTo || ""
  }`;

  const cached = getCache(cacheKey);

  if (cached) {
    console.log("CACHE HIT:", cacheKey);
    return res.json(cached);
  }

  console.log("CACHE MISS:", cacheKey);

  const filter = { teamId };

  if (search) filter.title = { $regex: search, $options: "i" };
  if (assignedTo) filter.assignedTo = assignedTo;

  const tasks = await Task.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  setCache(cacheKey, tasks);

  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
    new: true,
  });
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  await deleteByPattern(`tasks:${task.teamId}:*`);

  addActivity({
    taskId: task._id,
    action: "UPDATED",
    userId: req.user._id,
  });

  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  await deleteByPattern(`tasks:${task.teamId}:*`);

  addActivity({
    taskId: task._id,
    action: "DELETED",
    userId: req.user._id,
  });

  res.json({ message: "Deleted" });
};

exports.moveTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.taskId,
    {
      status: req.body.status,
    },
    { new: true }
  );
  await deleteByPattern(`tasks:${task.teamId}:*`);

  addActivity({
    taskId: task._id,
    action: "MOVED",
    userId: req.user._id,
  });

  res.json(task);
};

exports.assignTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.taskId,
    { assignedTo: req.body.userId },
    { new: true }
  );

  await deleteByPattern(`tasks:${task.teamId}:*`);

  addActivity({
    taskId: task._id,
    action: "ASSIGNED",
    userId: req.user._id,
  });

  res.json(task);
};

exports.addComment = async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  task.comments.push({
    text: req.body.text,
    createdBy: req.user._id,
  });

  await deleteByPattern(`tasks:${task.teamId}:*`);

  await task.save();
  res.json(task);
};
