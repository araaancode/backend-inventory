// models/FinancialFund.js

const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const financialFundSchema = new mongoose.Schema(
  {
    fundName:{type:String},
    initialStock:{type:Number},
    moreInfo:{type:String},
  },
  { timestamps: true }
);

module.exports = mongoose.model("FinancialFund", financialFundSchema);
