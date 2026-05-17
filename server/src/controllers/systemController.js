const os = require("os");

const getSystemHealth = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      platform: os.platform(),
      architecture: os.arch(),
      cpuCores: os.cpus().length,
      totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      uptime: `${(os.uptime() / 60).toFixed(2)} minutes`,
      hostname: os.hostname(),
      loadAverage: os.loadavg(),
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSystemHealth,
};