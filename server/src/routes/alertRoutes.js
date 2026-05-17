const express = require("express");
const router = express.Router();

const {
  getAlerts,
  getAlertHistory,
} = require("../controllers/alertController");

router.get("/", getAlerts);
router.get("/history", getAlertHistory);

module.exports = router;
