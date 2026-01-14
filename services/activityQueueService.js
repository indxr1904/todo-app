const queue = [];

exports.addActivity = (activity) => {
  queue.push(activity);
  console.log("Queued activity", activity);
};

exports.getQueue = () => queue;

exports.clearQueue = () => {
  queue.length = 0;
};
