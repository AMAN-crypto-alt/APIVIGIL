const express = require("express");
const router = express.Router();

const {
  getAggregatedMetrics,
} = require("../controllers/aggregationController");

router.get("/", getAggregatedMetrics);

module.exports = router;