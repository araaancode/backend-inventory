const mongoose = require("mongoose");
const validator = require("validator");

const financialSchema = new mongoose.Schema(
  {
    // ایجاد کننده
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      validate: {
        validator: async function (value) {
          if (!value) return true; // Optional field
          const user = await mongoose.model("User").findById(value);
          return !!user;
        },
        message: "Invalid seller reference - user not found",
      },
    },

    // فروشنده
    salesman: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "salesman reference is required"],
      validate: {
        validator: async function (value) {
          const user = await mongoose.model("User").findById(value);
          return !!user;
        },
        message: "Invalid salesman reference - user not found",
      },
    },

    // مشتری
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Customer reference is required"],
      validate: {
        validator: async function (value) {
          const user = await mongoose.model("User").findById(value);
          return !!user;
        },
        message: "Invalid customer reference - user not found",
      },
    },
    // کالاها
    products: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        count: {
          type: Number,
          default: 1,
          min: 1,
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: 0,
        },
      },
    ],

    // خدمات
    services: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Service",
        count: {
          type: Number,
          default: 1,
          min: 1,
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: 0,
        },
      },
    ],
    // مبلغ کلی تخفیف
    discountAmount: { type: Number },

    // پرداختی یا دریافتی
    receiptPay: {
      type: Number,
      
    },
    //  چک دریافتی یا پرداختی
    receiptPayChecks: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "BankCheck",
          validate: {
            validator: async function (value) {
              const check = await mongoose.model("BankCheck").findById(value);
              return !!check;
            },
            message: "Invalid bank check reference - check not found",
          },
        },
      ],
      validate: {
        validator: function (checks) {
          return checks.length <= 10; // Maximum 10 checks
        },
        message: "Cannot have more than 10 receipt checks",
      },
    },

    // تاریخ
    financialDate: {
      type: Date,
      default: Date.now(),
    },
    // شماره فاکتور
    factorNumber: {
      type: Number,
      validate: {
        validator: function (value) {
          if (!value) return true; // Optional field
          return value.toString().length >= 6 && value.toString().length <= 12;
        },
        message: "Factor number must be 6-12 digits",
      },
    },
    // اطلاعات بیشتر
    moreInfo: {
      type: String,
      maxlength: [500, "Additional info cannot exceed 500 characters"],
      trim: true,
    },

    // نوع
    financialType: {
      type: String,
      trim: true,
      required: [true, "نوع الزامی است"],
      enum: [
        "buy", // خرید
        "sale", // فروش
      ],
    },

    // بررسی وجود مالیات بر ارزش افزوده
    hasVat: {
      type: Boolean,
    },

    image: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Financial", financialSchema);
