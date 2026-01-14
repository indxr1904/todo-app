const NodeCache = require("node-cache");

const cache = new NodeCache({
  stdTTL: 60,
  checkperiod: 120,
});

exports.getCache = (key) => {
  return cache.get(key);
};

exports.setCache = (key, value) => {
  cache.set(key, value);
};

exports.deleteByPattern = (pattern) => {
  const keys = cache
    .keys()
    .filter((k) => k.startsWith(pattern.replace("*", "")));
  keys.forEach((k) => cache.del(k));
};
