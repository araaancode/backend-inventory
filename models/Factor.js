const mongoose = require("mongoose");
const validator = require("validator");

const factorSchema = new mongoose.Schema(
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
    factorDate: {
      type: Date,
      required: [true, "Invoice date is required"],
      default: Date.now,
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
    // مالیات
    tax: {
      type: Number,
      required: [true, "Tax amount is required"],
      min: [0, "Tax cannot be negative"],
      max: [100, "Tax cannot exceed 100%"],
    },
    // نوع فاکتور
    factorType: {
      type: String,
      enum: [
        "invoice", // فاکتور اصلی
        "proforma", // پیش فاکتور
      ],
      default: "proforma",
    },
    // جمع نهایی
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
      validate: {
        validator: function (value) {
          // Basic validation that total isn't less than tax
          return value >= this.tax;
        },
        message: "Total price cannot be less than tax amount",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-validate that at least products or services exist
factorSchema.pre("validate", function (next) {
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
factorSchema.pre("save", async function (next) {
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

module.exports = mongoose.model("Factor", factorSchema);
