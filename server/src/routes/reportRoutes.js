const express = require("express");
const router = express.Router();

const {
  getSystemReport,
} = require("../controllers/reportController");

router.get("/", getSystemReport);

module.exports = router;