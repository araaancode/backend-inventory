// models/Refund.js

const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const refundSchema = new mongoose.Schema(
  {
  
  },
  { timestamps: true }
);


module.exports = mongoose.model("Refund", refundSchema);
