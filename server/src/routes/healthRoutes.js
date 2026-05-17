const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    server: "running",
    database: "connected",
    redis: "active",
    timestamp: new Date(),
  });
});

module.exports = router;