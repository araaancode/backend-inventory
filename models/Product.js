const mongoose = require("mongoose");
const validator = require("validator");

const subGroupSchema = new mongoose.Schema({
  whichMainGroup: {
    type: mongoose.Schema.ObjectId,
    ref: "ProductGroup",
    required: [true, "Subgroup must belong to a main group"],
    validate: {
      validator: async function (value) {
        const group = await mongoose.model("ProductGroup").findById(value);
        return group !== null;
      },
      message: "No product group found with this ID",
    },
  },
});

const productGroupSchema = new mongoose.Schema({
  mainGroup: {
    type: String,
    required: [true, "Main group is required"],
    trim: true,
    maxlength: [50, "Main group name cannot exceed 50 characters"],
  },
  subGroup: {
    type: subGroupSchema,
    validate: {
      validator: function (value) {
        return value.whichMainGroup !== undefined;
      },
      message: "Subgroup must reference a valid main group",
    },
  },
  hashtag: {
    type: String,
    trim: true,
    maxlength: [30, "Hashtag cannot exceed 30 characters"],
    validate: {
      validator: function (value) {
        if (!value) return true;
        return value.startsWith("#") && value.length > 1;
      },
      message: "Hashtag must start with # and contain at least one character",
    },
  },
});

const secondaryUnitSchema = new mongoose.Schema({
  countingUnit: {
    type: String,
    required: [true, "Counting unit is required"],
    trim: true,
    maxlength: [20, "Counting unit cannot exceed 20 characters"],
  },
  subunitRatio: {
    type: Number,
    required: [true, "Subunit ratio is required"],
    min: [0.01, "Subunit ratio must be greater than 0"],
  },
  openingInventoryMainUnit: {
    type: Number,
    default: 0,
    min: [0, "Opening inventory cannot be negative"],
  },
  openingInventorySubUnit: {
    type: Number,
    default: 0,
    min: [0, "Opening inventory cannot be negative"],
  },
  purchasePriceMainUnit: {
    type: Number,
    default: 0,
    min: [0, "Purchase price cannot be negative"],
  },
  purchasePriceSubUnit: {
    type: Number,
    default: 0,
    min: [0, "Purchase price cannot be negative"],
  },
  sellingPriceMainUnit: {
    type: Number,
    default: 0,
    min: [0, "Selling price cannot be negative"],
  },
  sellingPriceSubUnit: {
    type: Number,
    default: 0,
    min: [0, "Selling price cannot be negative"],
  },
  secondSellingMainUnit: {
    type: Number,
    default: 0,
    min: [0, "Second selling price cannot be negative"],
  },
  secondSellingSubUnit: {
    type: Number,
    default: 0,
    min: [0, "Second selling price cannot be negative"],
  },
});

const moreInfoSchema = new mongoose.Schema({
  additionalInformation: {
    type: String,
    trim: true,
    maxlength: [500, "Additional information cannot exceed 500 characters"],
  },
  factorDescription: {
    type: String,
    trim: true,
    maxlength: [200, "Factor description cannot exceed 200 characters"],
  },
  barcode: {
    type: String,
    trim: true,
    validate: {
      validator: function (value) {
        if (!value) return true;
        return (
          validator.isNumeric(value) && value.length >= 8 && value.length <= 13
        );
      },
      message: "Barcode must be 8-13 numeric characters",
    },
  },
  minExpireWarningDays: {
    type: Number,
    min: [0, "Minimum expire warning days cannot be negative"],
  },
  minStock: {
    type: Number,
    min: [0, "Minimum stock cannot be negative"],
  },
  vatPercent: {
    type: Number,
    min: [0, "VAT percentage cannot be negative"],
    max: [100, "VAT percentage cannot exceed 100%"],
  },
  weight: {
    type: Number,
    min: [0, "Weight cannot be negative"],
  },
  length: {
    type: Number,
    min: [0, "Length cannot be negative"],
  },
  width: {
    type: Number,
    min: [0, "Width cannot be negative"],
  },
  height: {
    type: Number,
    min: [0, "Height cannot be negative"],
  },
});

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "seller reference is required"],
      validate: {
        validator: async function (value) {
          const user = await mongoose.model("User").findById(value);
          return !!user;
        },
        message: "No user found with this ID",
      },
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: [3, "Product title must be at least 3 characters"],
      maxlength: [50, "Product title cannot exceed 50 characters"],
    },
    productCode: {
      type: String,
      unique: true,
      trim: true,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return /^[A-Za-z0-9\-_]+$/.test(value);
        },
        message:
          "Product code can only contain letters, numbers, hyphens, and underscores",
      },
      required: [true, "Product Code is required"],

    },
    productGroup: {
      type: productGroupSchema,
      required: [true, "Product group is required"],
    },
    countingUnit: {
      type: String,
      required: [true, "Counting unit is required"],
      trim: true,
      maxlength: [20, "Counting unit cannot exceed 20 characters"],
    },
    secondaryUnit: secondaryUnitSchema,
    moreInfo: moreInfoSchema,
    image:{
      type:String,
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Fix the model name (it was incorrectly exporting as 'User')
module.exports = mongoose.model("Product", productSchema);
