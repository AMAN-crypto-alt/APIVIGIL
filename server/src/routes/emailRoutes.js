const express = require("express");
const router = express.Router();

const {
  sendAlertEmail,
} = require("../controllers/emailController");

router.get("/", sendAlertEmail);

module.exports = router;