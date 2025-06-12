const mongoose = require("mongoose");
const validator = require("validator");

const financialSchema = new mongoose.Schema(
  {
    // فروشنده
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
        validate: {
          validator: async function (value) {
            // Cache the model lookup for better performance
            if (!this.productModel)
              this.productModel = mongoose.model("Product");
            const product = await this.productModel.findById(value);
            return !!product;
          },
          message: "Product not found",
        },
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
        validate: {
          validator: async function (value) {
            // Cache the model lookup for better performance
            if (!this.serviceModel)
              this.serviceModel = mongoose.model("service");
            const service = await this.serviceModel.findById(value);
            return !!service;
          },
          message: "service not found",
        },
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
    // پرداختی یا دریافتی
    receipt: {
      type: mongoose.Schema.ObjectId,
      ref: "Paycheck",
      validate: {
        validator: async function (value) {
          if (!value) return true; // Optional field
          const paycheck = await mongoose.model("Paycheck").findById(value);
          return !!paycheck;
        },
        message: "Invalid paycheck reference - paycheck not found",
      },
    },
    //  چک دریافتی یا پرداختی
    receiptChecks: {
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
    // مبلغ کلی تخفیف
    discountAmount:{type:Number},
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

    // بررسی وجود مالیات بر ارزش افزوده
    hasVat:{
      type:Boolean
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Financial", financialSchema);
