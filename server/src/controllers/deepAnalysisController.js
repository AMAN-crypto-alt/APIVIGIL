const AggregatedMetric = require("../models/AggregatedMetric");

const getDeepAnalysis = async (req, res) => {
  try {
    // 🔥 latest aggregated data
    const data = await AggregatedMetric.find()
      .sort({ createdAt: -1 })
      .limit(50);

    if (!data.length) {
      return res.json({ success: true, analysis: null });
    }

    const services = {};

    // 🔥 group by service
    data.forEach((d) => {
      if (!services[d.serviceName]) {
        services[d.serviceName] = [];
      }
      services[d.serviceName].push(d);
    });

    let analysis = [];

    // 🔥 analyze each service
    for (const service in services) {
      const items = services[service];

      const avgCpu =
        items.reduce((sum, i) => sum + (i.avgCpu || 0), 0) / items.length;

      const avgMemory =
        items.reduce((sum, i) => sum + (i.avgMemory || 0), 0) / items.length;

      const avgLatency =
        items.reduce((sum, i) => sum + (i.avgLatency || 0), 0) / items.length;

      const avgError =
        items.reduce((sum, i) => sum + (i.errorRate || 0), 0) / items.length;

      // 🔥 score (AI style)
      const score =
        avgError * 2 +
        avgCpu * 10 +
        avgLatency * 0.05 +
        avgMemory * 5;

      let status = "healthy";
      let impact = "low";

      if (score > 200) {
        status = "critical";
        impact = "high";
      } else if (score > 100) {
        status = "warning";
        impact = "medium";
      }

      analysis.push({
        service,
        avgCpu: avgCpu.toFixed(2),
        avgMemory: avgMemory.toFixed(2),
        avgLatency: Math.round(avgLatency),
        avgError: avgError.toFixed(1),
        score: score.toFixed(2),
        status,
        impact,
      });
    }

    // 🔥 sort by worst service
    analysis.sort((a, b) => b.score - a.score);

    // 🔥 detect cascading issue
    let insight = "System stable";

    if (analysis.length > 1) {
      const worst = analysis[0];
      const second = analysis[1];

      if (worst.status === "critical" && second.status !== "healthy") {
        insight = `Possible cascading failure from ${worst.service}`;
      }
    }

    const result = {
      services: analysis,
      insight,
      topService: analysis[0]?.service,
    };

    // 🔥 SOCKET EMIT
    const io = req.app.get("io");
    if (io) {
      io.emit("deep-analysis", result);
    }

    res.json({
      success: true,
      analysis: result,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Deep analysis failed",
      error: err.message,
    });
  }
};

module.exports = { getDeepAnalysis };