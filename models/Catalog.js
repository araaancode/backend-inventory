// models/Catalog.js

const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const catalogSchema = new mongoose.Schema(
  {
  
  },
  { timestamps: true }
);


module.exports = mongoose.model("Catalog", catalogSchema);
