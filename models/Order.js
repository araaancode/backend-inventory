const mongoose = require("mongoose");
const validator = require("validator");

const orderSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Seller reference is required"],
      index: true, 
    },
    title: {
      type: String,
      required: [true, "Order title is required"],
      trim: true,
      minlength: [3, "Order title must be at least 3 characters"],
      maxlength: [100, "Order title cannot exceed 100 characters"],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9\u0600-\u06FF\s\-_]+$/.test(value);
        },
        message:
          "Order title can only contain letters, numbers, and Persian characters",
      },
    },
    orderOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order owner is required"],
      validate: {
        validator: async function (value) {
          const user = await mongoose.model("User").findById(value);
          return user !== null;
        },
        message: "No user found with this ID",
      },
    },
    moreInfo: {
      type: String,
      trim: true,
      maxlength: [500, "Additional information cannot exceed 500 characters"],
    },
    orderDate: {
      type: Date,
      required: [true, "Order date is required"],
      default: Date.now,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Order date cannot be in the future",
      },
    },
    catalog: {
      type: mongoose.Schema.ObjectId,
      ref: "Catalog",
      validate: {
        validator: async function (value) {
          if (!value) return true;
          const catalog = await mongoose.model("Catalog").findById(value);
          return catalog !== null;
        },
        message: "No catalog found with this ID",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "processing", "completed", "cancelled"],
        message:
          "Status must be either pending, processing, completed, or cancelled",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Order", orderSchema);
