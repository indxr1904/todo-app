const cron = require("node-cron");
const Activity = require("../models/Activity");

const { getQueue, clearQueue } = require("../services/activityQueueService");

console.log("Activity worker started");

cron.schedule("*/10 * * * * *", async () => {
  const queue = getQueue();
  console.log("Queue length", queue.length);

  if (queue.length === 0) return;

  await Activity.insertMany(queue);
  console.log(`Saved ${queue.length} activities`);

  clearQueue();
});
