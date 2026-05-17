const Metric = require("../models/Metric");
const AggregatedMetric = require("../models/AggregatedMetric");

const runAggregation = async () => {
  try {
    const since = new Date(Date.now() - 60 * 1000); // last 1 min

    const results = await Metric.aggregate([
      { $match: { createdAt: { $gte: since } } },

      {
        $group: {
          _id: {
            service: "$serviceName",
            minute: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: "$createdAt",
              },
            },
          },
          count: { $sum: 1 },
          errors: {
            $sum: { $cond: [{ $eq: ["$success", false] }, 1, 0] },
          },
          avgCpu: { $avg: "$cpuUsage" },
          avgMemory: { $avg: "$memoryUsage" },
          avgLatency: { $avg: "$responseTime" },
        },
      },

      {
        $project: {
          serviceName: "$_id.service",
          timeBucket: "$_id.minute",
          requestCount: "$count",
          avgCpu: 1,
          avgMemory: 1,
          avgLatency: 1,
          errorRate: {
            $multiply: [{ $divide: ["$errors", "$count"] }, 100],
          },
        },
      },
    ]);

    // 🔥 Save to DB
    for (const item of results) {
      await AggregatedMetric.findOneAndUpdate(
        {
          serviceName: item.serviceName,
          timeBucket: item.timeBucket,
        },
        item,
        { upsert: true, new: true }
      );
    }

    console.log("📊 Aggregation completed");

  } catch (err) {
    console.error("❌ Aggregation error:", err.message);
  }
};

module.exports = { runAggregation };
