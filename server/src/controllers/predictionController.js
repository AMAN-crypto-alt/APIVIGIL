const os = require("os");

let history = [];

// 🔥 Z-score based anomaly
const detectAnomaly = (value, avg, std) => {
  if (!std) return false;
  const z = Math.abs((value - avg) / std);
  return z > 2;
};

const getPredictions = (req, res) => {
  try {
    const totalMemory = os.totalmem() / 1024 / 1024 / 1024;
    const freeMemory = os.freemem() / 1024 / 1024 / 1024;
    const usedMemory = totalMemory - freeMemory;
    const cpuLoad = os.loadavg()[0];

    const current = {
      cpu: cpuLoad,
      memory: usedMemory,
      time: Date.now(),
    };

    // 🔥 history maintain
    history.push(current);
    history = history.slice(-20);

    // 🔥 Moving Average
    const avgCpu =
      history.reduce((sum, item) => sum + item.cpu, 0) / history.length;

    const avgMemory =
      history.reduce((sum, item) => sum + item.memory, 0) / history.length;

    // 🔥 Standard Deviation
    const stdCpu = Math.sqrt(
      history.reduce((sum, item) => sum + Math.pow(item.cpu - avgCpu, 2), 0) /
        history.length
    );

    const stdMemory = Math.sqrt(
      history.reduce(
        (sum, item) => sum + Math.pow(item.memory - avgMemory, 2),
        0
      ) / history.length
    );

    // 🔥 Z-score
    const zCpu = (cpuLoad - avgCpu) / (stdCpu || 1);
    const zMemory = (usedMemory - avgMemory) / (stdMemory || 1);

    const isAnomaly =
      detectAnomaly(cpuLoad, avgCpu, stdCpu) ||
      detectAnomaly(usedMemory, avgMemory, stdMemory);

    // 🔥 Trend calculation
    let trendScore = 0;
    if (history.length >= 3) {
      const latest = history[history.length - 1];
      const previous = history[history.length - 3];

      trendScore += latest.cpu - previous.cpu;
      trendScore += latest.memory - previous.memory;
    }

    // 🔥 AI Risk Score
    let riskScore =
      Math.abs(zCpu) * 2 +
      Math.abs(zMemory) * 2 +
      Math.max(0, trendScore);

    let probability = Math.min(100, Math.round(riskScore * 20));

    // 🔥 Risk classification
    let risk = "low";
    if (probability > 70) risk = "high";
    else if (probability > 40) risk = "medium";

    // 🔥 Message logic
    let message = "System stable";

    if (isAnomaly) {
      message = "Anomaly detected 🚨";
      risk = "high";
    } else if (risk === "high") {
      message = "High chance of failure 🚨";
    } else if (risk === "medium") {
      message = "System under stress ⚠";
    }

    // 🔥 Hard overrides (safety)
    if (cpuLoad > 2.5) {
      risk = "high";
      message = "CPU spike detected 🚨";
      probability = 90;
    }

    if (usedMemory / totalMemory > 0.85) {
      risk = "high";
      message = "Memory usage critically high 🚨";
      probability = 95;
    }

    const predictions = [
      {
        risk,
        probability,
        message,
        cpu: cpuLoad.toFixed(2),
        memory: usedMemory.toFixed(2),
        zScoreCpu: zCpu.toFixed(2),
        zScoreMemory: zMemory.toFixed(2),
        avgCpu: avgCpu.toFixed(2),
        avgMemory: avgMemory.toFixed(2),
        trendScore: trendScore.toFixed(2),
        isAnomaly,
      },
    ];

    // 🔥 REAL-TIME SOCKET EMIT
    const io = req.app.get("io");
    if (io) {
      io.emit("predictions", predictions);
    }

    res.status(200).json({
      success: true,
      predictions,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Prediction failed",
      error: error.message,
    });
  }
};

module.exports = {
  getPredictions,
  detectAnomaly,
};