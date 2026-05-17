const express = require("express");
const router = express.Router();
const {
  getAnalytics,
  getErrorTrends,
} = require("../controllers/analyticsController");

router.get("/", getAnalytics);
router.get("/trends", getErrorTrends);

module.exports = router;
