const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err.message);
});

redisClient.on("connect", () => {
  console.log("Redis Connected Successfully");
});

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.log("Redis Connection Failed:", error.message);
  }
};

module.exports = {
  redisClient,
  connectRedis,
};