// models/Refund.js

const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const refundSchema = new mongoose.Schema(
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

    products: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          validate: {
            validator: async function (value) {
              const product = await mongoose.model("Product").findById(value);
              return !!product;
            },
            message: "Invalid product reference - product not found",
          },
        },
      ],
      validate: {
        validator: function (products) {
          return products.length > 0 || this.services.length > 0;
        },
        message: "Transaction must contain at least one product or service",
      },
    },
    services: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Service",
          validate: {
            validator: async function (value) {
              const service = await mongoose.model("Service").findById(value);
              return !!service;
            },
            message: "Invalid service reference - service not found",
          },
        },
      ],
      validate: {
        validator: function (services) {
          return services.length > 0 || this.products.length > 0;
        },
        message: "Transaction must contain at least one product or service",
      },
    },

    returningDate:{
      type: Date,
      required: [true, 'تاریخ رسید الزامی است'],
      validate: {
        validator: function(value) {
          return value <= new Date();
        },
        message: 'تاریخ رسید نمی‌تواند در آینده باشد'
      }
    },
    moreInfo: {
      type: String,
      trim: true,
      maxlength: [500, 'اطلاعات بیشتر نمی‌تواند بیش از ۵۰۰ کاراکتر باشد']
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Refund", refundSchema);
