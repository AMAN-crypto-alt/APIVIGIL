const express = require("express");
const router = express.Router();

const {
  enableChaos,
  disableChaos,
  getChaosState,
} = require("../controllers/chaosController");

router.post("/enable", enableChaos);
router.post("/disable", disableChaos);
router.get("/state", getChaosState);

module.exports = router;