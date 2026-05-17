const express = require("express");
const router = express.Router();

const {
  getRootCause,
} = require("../controllers/rootCauseController");

// =========================
// 🔥 GET ROOT CAUSE (MAIN API)
// =========================
router.get("/", getRootCause);

// =========================
// 🔥 HEALTH CHECK (DEBUG)
// =========================
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Root Cause service is running",
  });
});

module.exports = router;