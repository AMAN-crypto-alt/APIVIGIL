const express = require("express");
const router = express.Router();
const { ingestMetrics } = require("../controllers/ingestController");

router.post("/", ingestMetrics);

module.exports = router;