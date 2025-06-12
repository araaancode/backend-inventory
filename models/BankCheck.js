// models/BankCheck.js
const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const bankCheckSchema = new mongoose.Schema(
  {
    // ایجاد کننده این نمونه
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "ایجاد کننده الزامی است"],
      validate: {
        validator: async function (value) {
          const user = await mongoose.model("User").findById(value);
          return !!user;
        },
        message: "ایجاد کننده معتبر نیست",
      },
      index: true // افزودن ایندکس برای جستجوی سریعتر
    },
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
      index: true
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
      index: true
    },
    // مبلغ چک
    checkPrice: {
      type: Number,
      required: [true, "مبلغ چک الزامی است"],
      min: [0, "مبلغ چک نمی‌تواند منفی باشد"],
      set: v => Math.round(v * 100) / 100 // ذخیره با دقت دو رقم اعشار
    },
    // تاریخ سررسید
    dueDate: {
      type: Date,
      required: [true, "تاریخ سررسید الزامی است"],
      // validate: {
      //   validator: function(value) {
      //     return value > new Date();
      //   },
      //   message: "تاریخ سررسید باید در آینده باشد"
      // }
    },
    // تاریخ و ساعت دریافت
    receivingCheckDate: {
      type: Date,
      default: Date.now,
      // validate: {
      //   validator: function(value) {
      //     return value <= new Date();
      //   },
      //   message: "تاریخ دریافت نمی‌تواند در آینده باشد"
      // }
    },
    // بانک صادر کننده
    bank: {
      type: String,
      required: [true, "نام بانک الزامی است"],
      trim: true,
      enum: [
        "ملت", "ملی", "صادرات", "تجارت", "رفاه", 
        "کشاورزی", "مسکن", "صنعت و معدن", "سایر"
      ]
    },
    // شماره چک
    bankCheckNumber: {
      type: String,
      required: [true, "شماره چک الزامی است"],
      unique: true,
      validate: {
        validator: function(v) {
          return /^\d{5,20}$/.test(v);
        },
        message: "شماره چک باید بین 5 تا 20 رقم باشد"
      }
    },
    // اطلاعات بیشتر
    moreInfo: {
      type: String,
      maxlength: [500, "توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد"],
      trim: true
    },
    // واگذاری چک
    endorsementCheck: {
      type: String,
      enum: ["واگذار شده", "واگذار نشده", "در حال بررسی"],
      default: "واگذار نشده"
    },
    // تاریخ واگذاری چک
    endorsementCheckDate: {
      type: Date,
      // validate: {
      //   validator: function(value) {
      //     if (!this.endorsementCheck || this.endorsementCheck === "واگذار نشده") {
      //       return true;
      //     }
      //     return value <= new Date();
      //   },
      //   message: "تاریخ واگذاری نامعتبر است"
      // }
    },
    // نوع چک
    checkType: {
      type: String,
      trim: true,
      required: [true, "نوع چک الزامی است"],
      enum: [
        "receipt", // دریافتی
        "pay", // پرداختی
      ]
    },
    image: { 
      type: String,
    },
    // وضعیت چک
    status: {
      type: String,
      enum: ["فعال", "مسدود", "وصول شده", "برگشت خورده"],
      default: "فعال"
    },
    // تاریخ آخرین تغییر وضعیت
    statusChangedAt: {
      type: Date
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

bankCheckSchema.index({ seller: 1, status: 1 });
bankCheckSchema.index({ payer: 1, dueDate: 1 });
bankCheckSchema.index({ recipient: 1, checkType: 1 });

bankCheckSchema.pre('save', function(next) {
  if (this.endorsementCheck === "واگذار شده" && !this.endorsementCheckDate) {
    this.endorsementCheckDate = new Date();
  }
  
  if (this.isModified('status')) {
    this.statusChangedAt = new Date();
  }
  
  next();
});

bankCheckSchema.methods.isExpired = function() {
  return this.dueDate < new Date();
};

bankCheckSchema.methods.getDaysUntilDue = function() {
  const diffTime = this.dueDate - new Date();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = mongoose.model("BankCheck", bankCheckSchema);