const Metric = require("../models/Metric");

const getRootCause = async (req, res) => {
  try {
    // 🔥 Last 5 minutes data
    const since = new Date(Date.now() - 5 * 60 * 1000);

    const results = await Metric.aggregate([
      { $match: { createdAt: { $gte: since } } },

      {
        $group: {
          _id: "$serviceName",
          total: { $sum: 1 },
          errors: {
            $sum: { $cond: [{ $eq: ["$success", false] }, 1, 0] },
          },
          avgCpu: { $avg: "$cpuUsage" },
          avgMem: { $avg: "$memoryUsage" },
          avgLatency: { $avg: "$responseTime" },
        },
      },

      {
        $project: {
          total: 1,
          avgCpu: { $ifNull: ["$avgCpu", 0] },
          avgMem: { $ifNull: ["$avgMem", 0] },
          avgLatency: { $ifNull: ["$avgLatency", 0] },
          errorRate: {
            $multiply: [
              {
                $cond: [
                  { $eq: ["$total", 0] },
                  0,
                  { $divide: ["$errors", "$total"] },
                ],
              },
              100,
            ],
          },
        },
      },

      // 🔥 Advanced AI Score
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$errorRate", 1.5] },   // most important
              { $multiply: ["$avgCpu", 12] },
              { $multiply: ["$avgLatency", 0.08] },
              { $multiply: ["$avgMem", 5] },
            ],
          },
        },
      },

      { $sort: { score: -1 } },
      { $limit: 3 }, // 🔥 multiple root causes
    ]);

    if (!results.length) {
      return res.json({ success: true, rootCauses: [] });
    }

    // 🔥 Smart reasoning engine
    const rootCauses = results.map((r) => {
      let reason = "System stable";
      let detail = "";
      let severity = "low";

      // 🔥 Priority logic
      if (r.errorRate > 40) {
        reason = "High error rate";
        detail = "Frequent API failures detected";
        severity = "critical";
      } 
      else if (r.avgCpu > 2.5) {
        reason = "High CPU load";
        detail = "System overloaded, causing performance issues";
        severity = "high";
      } 
      else if (r.avgLatency > 800) {
        reason = "High latency";
        detail = "Slow response times affecting user experience";
        severity = "high";
      } 
      else if (r.avgMem > 6) {
        reason = "High memory usage";
        detail = "Memory pressure detected";
        severity = "medium";
      } 
      else if (r.errorRate > 15) {
        reason = "Moderate error rate";
        detail = "Some API instability detected";
        severity = "medium";
      }

      return {
        service: r._id,
        errorRate: Number(r.errorRate.toFixed(1)),
        avgCpu: Number(r.avgCpu.toFixed(2)),
        avgLatency: Math.round(r.avgLatency),
        avgMemory: Number(r.avgMem.toFixed(2)),
        score: Number(r.score.toFixed(2)),
        reason,
        detail,
        severity,
      };
    });

    // 🔥 REAL-TIME SOCKET EMIT
    const io = req.app.get("io");
    if (io) {
      io.emit("root-cause", rootCauses);
    }

    res.json({
      success: true,
      rootCauses,
    });

  } catch (e) {
    console.error("RootCause ERROR:", e.message);

    res.status(500).json({
      success: false,
      message: "Root cause failed",
      error: e.message,
    });
  }
};

module.exports = { getRootCause };