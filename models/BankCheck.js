// models/BankCheck.js

const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const bankCheckSchema = new mongoose.Schema(
  {
    // پرداخت کننده
    payer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "پرداخت کننده الزامی است"],
      validate: {
        validator: async function (value) {
          const user = await mongoose.model("User").findById(value);
          return !!user;
        },
        message: "پرداخت کننده معتبر نیست",
      },
    },
    // دریافت کننده
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "دریافت کننده الزامی است"],
      validate: {
        validator: async function (value) {
          const user = await mongoose.model("User").findById(value);
          return !!user;
        },
        message: "دریافت کننده معتبر نیست",
      },
    },
    // مبلغ چک
    checkPrice: {
      type: Number,
    },
    // تاریخ سررسید
    dueDate: {
      type: Date,
    },
    // تاریخ و ساعت  دریافت
    receivingCheckDate: {
      type: Date,
    },
    // بانک صادر کننده
    bank: {
      type: String,
    },
    // شماره چک
    bankCheckNumber: {
      type: String,
    },
    // اطلاعات بیشتر
    moreInfo: {
      type: String,
    },
    // واگذاری چک
    endorsementCheck: {
      type: String,
    },
    //  تاریخ واگذاری چک
    endorsementCheckDate: {
      type: Date,
    },

    // نوع چک
    checkType: {
      type: String,
      trim: true,
      required: true,
      enum: [
        "receipt", // دریافتی
        "pay", // پرداختی
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BankCheck", bankCheckSchema);
