const os = require("os");
const Metric = require("../models/Metric");

const getSystemReport = async (req, res) => {
  try {
    const totalMetrics = await Metric.countDocuments();

    const latestMetrics = await Metric.find()
      .sort({ createdAt: -1 })
      .limit(10);

    let avgCpu = 0;
    let avgMemory = 0;

    if (latestMetrics.length > 0) {
      avgCpu =
        latestMetrics.reduce((sum, item) => sum + item.cpuUsage, 0) /
        latestMetrics.length;

      avgMemory =
        latestMetrics.reduce((sum, item) => sum + item.memoryUsage, 0) /
        latestMetrics.length;
    }

    // 🔥 Current system values
    const totalMemory = os.totalmem() / 1024 / 1024 / 1024;
    const freeMemory = os.freemem() / 1024 / 1024 / 1024;
    const usedMemory = totalMemory - freeMemory;
    const cpuLoad = os.loadavg()[0];

    // 🔥 Health Score Logic
    let healthScore = 100;

    if (cpuLoad > 2) healthScore -= 30;
    if (usedMemory / totalMemory > 0.7) healthScore -= 30;
    if (usedMemory / totalMemory > 0.85) healthScore -= 20;

    if (healthScore < 0) healthScore = 0;

    // 🔥 Status based on score
    let status = "Healthy";
    if (healthScore < 70) status = "Warning";
    if (healthScore < 40) status = "Critical";

    const report = {
      totalMetricsCollected: totalMetrics,

      healthScore, // 🔥 NEW
      status,      // 🔥 NEW

      serverInfo: {
        platform: os.platform(),
        cpuCores: os.cpus().length,
        totalMemoryGB: totalMemory.toFixed(2),
        freeMemoryGB: freeMemory.toFixed(2),
        usedMemoryGB: usedMemory.toFixed(2), // 🔥 NEW
      },

      performanceSummary: {
        averageCpuUsage: avgCpu.toFixed(2),
        averageMemoryUsage: avgMemory.toFixed(2),
        currentCpuLoad: cpuLoad.toFixed(2), // 🔥 NEW
      },

      generatedAt: new Date(),
    };

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate report",
      error: error.message,
    });
  }
};

module.exports = {
  getSystemReport,
};