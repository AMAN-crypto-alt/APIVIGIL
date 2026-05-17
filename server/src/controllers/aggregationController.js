const AggregatedMetric = require("../models/AggregatedMetric");

const getAggregatedMetrics = async (req, res) => {
  try {
    const data = await AggregatedMetric.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Aggregation fetch failed",
    });
  }
};

module.exports = { getAggregatedMetrics };