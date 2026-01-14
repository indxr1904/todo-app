const express = require("express");
const {
  createTeam,
  addMember,
  removeMember,
  getMembers,
} = require("../controller/teamController");
const protect = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createTeam);
router.post("/:id/members", protect, addMember);
router.delete("/:id/members/:userId", protect, removeMember);
router.get("/:id/members", protect, getMembers);

module.exports = router;
