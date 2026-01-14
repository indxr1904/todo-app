const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const teamRoutes = require("./routes/teamRoutes");
const taskRoutes = require("./routes/taskRoutes");
const activityRoutes = require("./routes/activityRoutes");
require("./jobs/activityWorkers");

const app = express();

dotenv.config();

app.use(express.json());

mongoose
  .connect("mongodb://localhost/todoapp")
  .then(() => console.log("MongoDB connected successfully"));

app.use("/api/status", (req, res) => {
  res.send("server is live...");
});

app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api", taskRoutes);
app.use("/api/activities", activityRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
