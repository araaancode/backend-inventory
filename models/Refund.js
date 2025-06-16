const mongoose = require("mongoose");
const validator = require("validator");

const refundSchema = new mongoose.Schema(
  {
    // ایجاد  کننده
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "seller reference is required"],
    },

    // فروشنده
    salesman: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "salesman reference is required"],
    },

    // مشتری
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Customer reference is required"],
    },
    // تاریخ و مشخصات
    returnFactorDate: {
      type: Date,
      required: [true, "Invoice date is required"],
      default: Date.now,
    },
    // نوع
    returnFactorType: {
      type: String,
      enum: [
        "returnFrombuy", // برگشت از خرید
        "returnFromSale", // برگشت از فروش
      ],
      default: "returnFrombuy",
    },
    // کالاها
    products: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
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
        service: {
          type: mongoose.Schema.ObjectId,
          ref: "Service",
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

    // اطلاعات بیشتر
    moreInfo: {
      type: String,
      maxlength: [500, "Additional info cannot exceed 500 characters"],
      trim: true,
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

// Auto-validate that at least products or services exist
refundSchema.pre("validate", function (next) {
  if (this.products.length === 0 && this.services.length === 0) {
    this.invalidate(
      "products",
      "Invoice must contain products or services",
      this.products
    );
  }
  next();
});

// Calculate totalPrice if not provided (basic example)
refundSchema.pre("save", async function (next) {
  if (
    this.isModified("products") ||
    this.isModified("services") ||
    this.isModified("tax")
  ) {
    if (typeof this.totalPrice !== "number") {
      // Simple calculation - in real app you'd fetch actual prices
      const productCount = this.products.length;
      const serviceCount = this.services.length;
      const baseAmount = productCount * 1000 + serviceCount * 500; // Example values
      this.totalPrice = baseAmount + baseAmount * (this.tax / 100);
    }
  }
  next();
});

module.exports = mongoose.model("Refund", refundSchema);
