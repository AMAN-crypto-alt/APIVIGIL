const { metricsQueue } = require("../queues/metricsQueue");
const Metric = require("../models/Metric");
const { getChaosConfig } = require("../controllers/chaosController");

// 🔥 Import app to access io
const app = require("../app");

metricsQueue.process(async (job) => {
  try {
    // =========================
    // 🔥 0. CHAOS CONFIG
    // =========================
    const { chaosMode, chaosType } = getChaosConfig();

    let modifiedData = { ...job.data };

    // =========================
    // 🔥 CHAOS INJECTION
    // =========================
    if (chaosMode) {
      if (chaosType === "cpu") {
        modifiedData.cpuUsage = 3 + Math.random(); // spike
      }

      if (chaosType === "memory") {
        modifiedData.memoryUsage = 7 + Math.random(); // GB approx
      }

      if (chaosType === "error") {
        modifiedData.success = false;
        modifiedData.statusCode = 500;
      }

      if (chaosType === "latency") {
        await new Promise((r) => setTimeout(r, 2000)); // delay
      }
    }

    // =========================
    // 🔥 STORE METRIC
    // =========================
    const data = await Metric.create(modifiedData);

    console.log("✅ Metric stored");

    // =========================
    // 🔥 SOCKET IO
    // =========================
    const io = app.get("io");

    if (io) {
      // 🔹 1. LIVE METRICS
      io.emit("metrics", data);

      // =========================
      // 🔹 2. ALERT SYSTEM
      // =========================
      let alerts = [];

      if (data.cpuUsage > 2.5) {
        alerts.push({
          type: "critical",
          message: "High CPU detected 🚨",
        });
      }

      // memoryUsage is in GB (approx from SDK), threshold ~85% of 8GB demo
      if (data.memoryUsage > 0.85 * 8) {
        alerts.push({
          type: "warning",
          message: "Memory usage high ⚠",
        });
      }

      if (data.success === false) {
        alerts.push({
          type: "critical",
          message: "API failure detected ❌",
        });
      }

      if (alerts.length > 0) {
        io.emit("alerts", alerts);
      }

      // =========================
      // 🔹 3. AI PREDICTIONS (FAST PATH)
      // =========================
      let risk = "low";
      let probability = 20;
      let message = "System stable";

      if (data.cpuUsage > 2.5) {
        risk = "high";
        probability = 85;
        message = "High CPU spike detected 🚨";
      } else if (data.cpuUsage > 2) {
        risk = "medium";
        probability = 55;
        message = "System under load ⚠";
      }

      if (data.success === false) {
        risk = "high";
        probability = 90;
        message = "API failure detected 🚨";
      }

      const predictions = [
        {
          risk,
          probability,
          message,
          cpu: data.cpuUsage?.toFixed(2),
          memory: data.memoryUsage?.toFixed(2),
          isAnomaly: data.cpuUsage > 2.5 || data.success === false,
        },
      ];

      io.emit("predictions", predictions);

      // =========================
      // 🔹 4. ANALYTICS REFRESH
      // =========================
      io.emit("analytics-update");
    }
  } catch (err) {
    console.error("❌ Worker error:", err.message);
    throw err;
  }
});
