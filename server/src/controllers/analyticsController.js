const Metric = require("../models/Metric");

const getAnalytics = async (req, res) => {
  try {
    const result = await Metric.aggregate([
      {
        $group: {
          _id: "$serviceName",

          totalRequests: { $sum: 1 },

          successCount: {
            $sum: {
              $cond: [{ $eq: ["$success", true] }, 1, 0],
            },
          },

          errorCount: {
            $sum: {
              $cond: [{ $eq: ["$success", false] }, 1, 0],
            },
          },

          avgCpu: { $avg: "$cpuUsage" },
          avgMemory: { $avg: "$memoryUsage" },
        },
      },
      {
        $project: {
          totalRequests: 1,
          avgCpu: 1,
          avgMemory: 1,
          successRate: {
            $multiply: [
              { $divide: ["$successCount", "$totalRequests"] },
              100,
            ],
          },
          errorRate: {
            $multiply: [
              { $divide: ["$errorCount", "$totalRequests"] },
              100,
            ],
          },
        },
      },
    ]);

    res.json({
      success: true,
      analytics: result,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};

const getErrorTrends = async (req, res) => {
  try {
    const result = await Metric.aggregate([
      {
        $group: {
          _id: {
            service: "$serviceName",
            time: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: "$createdAt",
              },
            },
          },
          totalRequests: { $sum: 1 },
          errorCount: {
            $sum: {
              $cond: [{ $eq: ["$success", false] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          service: "$_id.service",
          time: "$_id.time",
          errorRate: {
            $cond: [
              { $eq: ["$totalRequests", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$errorCount", "$totalRequests"] },
                  100,
                ],
              },
            ],
          },
        },
      },
      {
        $sort: {
          time: 1,
          service: 1,
        },
      },
    ]);

    res.json({
      success: true,
      trends: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error trend analytics failed",
    });
  }
};

module.exports = { getAnalytics, getErrorTrends };
