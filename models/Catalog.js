// models/Catalog.js

const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const catalogSchema = new mongoose.Schema(
  {
    title:{
      type: String,
      required: [true, 'عنوان کاتالوگ الزامی است'],
      trim: true,
      minlength: [3, 'عنوان کاتالوگ باید حداقل ۳ کاراکتر باشد'],
      maxlength: [100, 'عنوان کاتالوگ نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'],
      validate: {
        validator: function(v) {
          return /^[\u0600-\u06FFa-zA-Z0-9\s\-_،.]+$/.test(v);
        },
        message: 'عنوان کاتالوگ فقط می‌تواند شامل حروف، اعداد و علائم نگارشی باشد'
      }
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Catalog", catalogSchema);
