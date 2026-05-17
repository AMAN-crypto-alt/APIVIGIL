const os = require("os");
const Alert = require("../models/Alert");
const { sendAlertEmail } = require("./emailController");

let lastEmailTime = 0;

const normalizeSeverity = (type) => {
  if (type === "critical") return "critical";
  if (type === "warning") return "warning";
  return "info";
};

const getAlerts = async (req, res) => {
  try {
    const alerts = [];

    const freeMemoryGB = os.freemem() / 1024 / 1024 / 1024;
    const cpuLoad = os.loadavg()[0];

    if (freeMemoryGB < 2) {
      alerts.push({
        type: "warning",
        severity: "warning",
        service: "system",
        message: "Low free memory detected",
      });
    }

    if (cpuLoad > 2) {
      alerts.push({
        type: "critical",
        severity: "critical",
        service: "system",
        message: "High CPU load detected",
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        type: "healthy",
        severity: "info",
        service: "system",
        message: "All systems are operating normally",
      });
    }

    await Alert.insertMany(
      alerts.map((alert) => ({
        service: alert.service || "system",
        message: alert.message,
        severity: alert.severity || normalizeSeverity(alert.type),
      }))
    );

    if (alerts.length > 0) {
      const now = Date.now();

      if (now - lastEmailTime > 60000) {
        lastEmailTime = now;

        sendAlertEmail(
          { body: {} },
          {
            status: () => ({
              json: () => {},
            }),
          }
        );
      }
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("alerts", alerts);
    }

    res.status(200).json({
      success: true,
      alerts,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Alert generation failed",
      error: error.message,
    });
  }
};

const getAlertHistory = async (req, res) => {
  try {
    const history = await Alert.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.status(200).json({
      success: true,
      alerts: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Alert history failed",
      error: error.message,
    });
  }
};

module.exports = {
  getAlerts,
  getAlertHistory,
};
