const Team = require("../models/Team");

exports.createTeam = async (req, res) => {
  const team = await Team.create({
    name: req.body.name,
    createdBy: req.user._id,
    members: [req.user._id],
  });
  res.status(200).json({
    team,
    message: "Team created successfully",
  });
};

exports.addMember = async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }
  if (!team.createdBy.equals(req.user._id)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  if (!team.members.includes(req.body.userId)) {
    team.members.push(req.body.userId);
    await team.save();
  }
  res.json(team);
};

exports.removeMember = async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }
  if (!team.createdBy.equals(req.user._id)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  team.members = team.members.filter((m) => m.toString() !== req.params.userId);
  await team.save();
  res.json(team);
};

exports.getMembers = async (req, res) => {
  const team = await Team.findById(req.params.id).populate("members", "email");
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }
  res.json(team.members);
};
