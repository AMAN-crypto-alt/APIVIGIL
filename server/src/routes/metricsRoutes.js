const express = require("express");
const router = express.Router();

const {
  getAllMetrics,
  getMongoMetrics,
  getRedisMetrics,
} = require("../controllers/metricsController");

/*
========================================
1. Get All Stored Metrics
GET /api/metrics
========================================
*/
router.get("/", getAllMetrics);

/*
========================================
2. Get Live MongoDB Metrics
GET /api/metrics/mongodb
========================================
*/
router.get("/mongodb", getMongoMetrics);

/*
========================================
3. Get Live Redis Metrics
GET /api/metrics/redis
========================================
*/
router.get("/redis", getRedisMetrics);

module.exports = router;