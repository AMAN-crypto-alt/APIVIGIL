const express = require("express");
const router = express.Router();

const {
  downloadPDFReport,
} = require("../controllers/pdfController");

router.get("/", downloadPDFReport);

module.exports = router;