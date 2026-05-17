const { runAggregation } = require("../services/aggregationService");

// 🔥 Run every 1 minute
setInterval(() => {
  runAggregation();
}, 60 * 1000);