const express = require("express");
const router = express.Router();

const {
  getPredictions,
} = require("../controllers/predictionController");

router.get("/", getPredictions);

module.exports = router;