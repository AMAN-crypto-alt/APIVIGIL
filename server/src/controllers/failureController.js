const Metric = require("../models/Metric");
const Failure = require("../models/Failure");

const getFailures = async (req, res) => {
  try {
    // 🔥 Last 50 metrics fetch karo
    const metrics = await Metric.find()
      .sort({ createdAt: -1 })
      .limit(50);

    let failures = [];

    // 🔥 Service-wise grouping
    const services = {};

    metrics.forEach((m) => {
      if (!services[m.serviceName]) {
        services[m.serviceName] = [];
      }
      services[m.serviceName].push(m);
    });

    // 🔥 Har service ka analysis
    for (const service in services) {
      const data = services[service];

      const total = data.length;
      const errors = data.filter((d) => !d.success).length;

      const errorRate = (errors / total) * 100;

      const avgLatency =
        data.reduce((sum, d) => sum + d.responseTime, 0) / total;

      // =========================
      // 🔥 1. ERROR RATE DETECTION
      // =========================
      if (errorRate > 50) {
        failures.push({
          serviceName: service,
          type: "error-rate",
          message: "High error rate detected 🚨",
          severity: "high",
          value: Number(errorRate.toFixed(2)),
        });
      } else if (errorRate > 20) {
        failures.push({
          serviceName: service,
          type: "error-rate",
          message: "Moderate error rate ⚠",
          severity: "medium",
          value: Number(errorRate.toFixed(2)),
        });
      }

      // =========================
      // 🔥 2. LATENCY SPIKE
      // =========================
      if (avgLatency > 1000) {
        failures.push({
          serviceName: service,
          type: "latency",
          message: "High latency detected 🚨",
          severity: "high",
          value: Number(avgLatency.toFixed(2)),
        });
      } else if (avgLatency > 500) {
        failures.push({
          serviceName: service,
          type: "latency",
          message: "Latency increasing ⚠",
          severity: "medium",
          value: Number(avgLatency.toFixed(2)),
        });
      }

      // =========================
      // 🔥 3. CONSECUTIVE FAILURES
      // =========================
      let streak = 0;

      for (let i = 0; i < data.length; i++) {
        if (!data[i].success) {
          streak++;
        } else {
          break;
        }
      }

      if (streak >= 5) {
        failures.push({
          serviceName: service,
          type: "crash",
          message: "Service might be down ❌",
          severity: "critical",
          value: streak,
        });
      }
    }

    // 🔥 Save failures (optional but useful)
    for (const f of failures) {
      await Failure.create(f);
    }

    // 🔥 Real-time emit
    const io = req.app.get("io");
    if (io) {
      io.emit("failures", failures);
    }

    res.status(200).json({
      success: true,
      failures,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failure detection failed",
      error: error.message,
    });
  }
};

module.exports = {
  getFailures,
};