const express = require("express");
const router = express.Router();

const {
  getDeepAnalysis,
} = require("../controllers/deepAnalysisController");

router.get("/", getDeepAnalysis);

module.exports = router;