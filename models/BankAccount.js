const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const bankAccountSchema = new mongoose.Schema(
  {
    // دارنده حساب
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "دارنده حساب باید وارد شود"],
      validate: {
        validator: async function (value) {
          const user = await mongoose.model("User").findById(value);
          return !!user;
        },
        message: "دارنده حساب معتبر نیست",
      },
    },

    image: {
      type: String,
    },

    // نام دارنده حساب
    holderFullName: {
      type: String,
      trim: true,
      required: [true, "نام کامل دارنده حساب الزامی است"],
    },

    // شماره حساب
    accountNumber: {
      type: String,
      trim: true,
      required: [true, "شماره حساب الزامی است"],
      unique: true,
      validate: {
        validator: function (val) {
          return /^\d+$/.test(val); // Basic validation for account number
        },
        message: "شماره حساب باید فقط شامل ارقام باشد",
      },
    },

    // شماره کارت بانکی
    cardNumber: {
      type: String,
      trim: true,
      required: [true, "شماره کارت الزامی است"],
      validate: {
        validator: function (val) {
          return val.length === 16 && /^\d+$/.test(val); // Basic card number validation
        },
        message: "شماره کارت باید 16 رقم باشد",
      },
    },

    // شماره شبا
    iban: {
      type: String,
      trim: true,
      required: [true, "شماره شبا الزامی است"],
      validate: {
        validator: function (val) {
          return val.startsWith("IR") && val.length === 26; // Basic IBAN validation
        },
        message: "شماره شبا باید با IR شروع شده و 26 کاراکتر باشد",
      },
    },

    // شعبه بانکی
    bankBranch: {
      type: String,
      trim: true,
      required: [true, "نام شعبه بانکی الزامی است"],
    },

    // موجودی حساب
    balance: {
      type: Number,
      required: [true, "موجودی حساب الزامی است"],
      min: [0, "موجودی نمی‌تواند منفی باشد"],
      default: 0,
    },

    // اطلاعات بیشتر
    additionalInfo: {
      type: String,
      trim: true,
    },

    // نام بانک
    bankName: {
      type: String,
      trim: true,
      required: [true, "نام بانک الزامی است"],
    },

    // وضعیت حساب
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add index for frequently queried fields
bankAccountSchema.index({ accountHolder: 1 });
bankAccountSchema.index({ accountNumber: 1 });
bankAccountSchema.index({ cardNumber: 1 });

module.exports = mongoose.model("BankAccount", bankAccountSchema);
