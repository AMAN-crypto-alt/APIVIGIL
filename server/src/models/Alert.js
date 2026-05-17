const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      required: true,
      default: "system",
    },
    message: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["info", "warning", "critical"],
      required: true,
      default: "info",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alert", alertSchema);
