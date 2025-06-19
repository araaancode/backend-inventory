// models/Catalog.js

const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const catalogSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "seller reference is required"],
    },
    title: {
      type: String,
      required: [true, "عنوان کاتالوگ الزامی است"],
      trim: true,
      minlength: [3, "عنوان کاتالوگ باید حداقل ۳ کاراکتر باشد"],
      maxlength: [100, "عنوان کاتالوگ نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Catalog", catalogSchema);
