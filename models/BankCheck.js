// models/BankCheck.js

const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const bankCheckSchema = new mongoose.Schema(
  {
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
    checkPrice:{
      type:Number,
    },
    dueDate:{
      type:Date,
    },
    receivingCheckDate:{
      type:Date
    },
    Bank:{
      type:String
    },
    bankCheckNumber:{
      type:String,
    },
    moreInfo:{
      type:String,
    },
    // واگذاری چک
    endorsementCheck:{
      type:String
    },
    //  تاریخ واگذاری چک
    endorsementCheckDate:{
      type:Date
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BankCheck", bankCheckSchema);
