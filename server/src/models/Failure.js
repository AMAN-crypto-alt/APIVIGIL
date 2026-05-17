const mongoose = require("mongoose");

const failureSchema = new mongoose.Schema(
  {
    serviceName: String,
    type: String, // error-rate / latency / crash
    message: String,
    severity: String, // low / medium / high
    value: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Failure", failureSchema);