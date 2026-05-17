const Metric = require("../models/Metric");

const isNumeric = (value) => typeof value === "number" && Number.isFinite(value);

const validateMetricsPayload = (req, res, next) => {
  const { serviceName, cpu, memory, timestamp } = req.body || {};

  if (!serviceName || typeof serviceName !== "string") {
    return res.status(400).json({
      success: false,
      message: "serviceName is required",
    });
  }

  if (!isNumeric(cpu?.usagePercent)) {
    return res.status(400).json({
      success: false,
      message: "cpu.usagePercent must be numeric",
    });
  }

  if (!isNumeric(memory?.usagePercent)) {
    return res.status(400).json({
      success: false,
      message: "memory.usagePercent must be numeric",
    });
  }

  if (!timestamp) {
    return res.status(400).json({
      success: false,
      message: "timestamp is required",
    });
  }

  const parsedTimestamp = new Date(timestamp);
  if (Number.isNaN(parsedTimestamp.getTime())) {
    return res.status(400).json({
      success: false,
      message: "timestamp must be a valid date",
    });
  }

  next();
};

const metricsMiddleware = async (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      const responseTime = Date.now() - start;

      await Metric.create({
        serviceName: "backend-server",
        timestamp: new Date(),
        requests: {
          endpoint: req.originalUrl,
          method: req.method,
          statusCode: res.statusCode,
          responseTimeMs: responseTime,
          success: res.statusCode < 400,
          errorCount: res.statusCode >= 400 ? 1 : 0,
        },
      });
    } catch {}
  });

  next();
};

module.exports = metricsMiddleware;
module.exports.validateMetricsPayload = validateMetricsPayload;
