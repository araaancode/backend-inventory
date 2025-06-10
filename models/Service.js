// models/Service.js

const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const serviceSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    image:{
      type:String
    },
    // نام خدمت
    serviceName: {
      type: String,
    },
    // واحد شمارش
    countingRatio: {
      type: String,
    },
    // هزینه تمام شده
    totalCost: {
      type: Number,
      default: 0,
    },
    // قیمت
    price: {
      type: Number,
      default: 0,
    },
    // اطلاعات بیشتر
    moreInfo: {
      type: String,
      maxlength: [500, "Additional info cannot exceed 500 characters"],
      trim: true,
    },
    // شرح  در فاکتور
    factorDescription: {
      type: String,
      maxlength: [500, "Additional info cannot exceed 500 characters"],
      trim: true,
    },
    // درصد مالیات
    vatPercent: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
