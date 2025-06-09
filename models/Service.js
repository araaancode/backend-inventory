// models/User.js

const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
    },
    countingRatio: {
      type: String,
    },
    totalCost: {
      type: NUmber,
    },
    moreInfo: {
      type: String,
      maxlength: [500, "Additional info cannot exceed 500 characters"],
      trim: true,
    },
    factorDescription: {
      type: String,
      maxlength: [500, "Additional info cannot exceed 500 characters"],
      trim: true,
    },
    vatPercent: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
