const express = require("express");
const router = express.Router();

const {
  getFailures,
} = require("../controllers/failureController");

// =========================
// 🔥 GET CURRENT FAILURES
// =========================
router.get("/", getFailures);

// =========================
// 🔥 HEALTH CHECK (optional debug)
// =========================
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Failure service is running",
  });
});

module.exports = router;