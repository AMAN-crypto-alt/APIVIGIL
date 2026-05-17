const mongoose = require("mongoose");

const aggregatedSchema = new mongoose.Schema(
  {
    serviceName: String,

    timeBucket: String, // "2026-05-05 14:30"

    avgCpu: Number,
    avgMemory: Number,
    avgLatency: Number,

    errorRate: Number,
    requestCount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AggregatedMetric", aggregatedSchema);