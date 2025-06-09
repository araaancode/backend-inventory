// models/BankCheck.js

const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const bankCheckSchema = new mongoose.Schema(
  {
  
  },
  { timestamps: true }
);


module.exports = mongoose.model("BankCheck", bankCheckSchema);
