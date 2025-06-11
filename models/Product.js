const mongoose = require("mongoose");
const validator = require("validator");

// mainGroup Schema
const mainGroupSchema = new mongoose.Schema({
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
  // نام گروه اصلی
  name: {
    type: String,
    required: [true, "MainGroup name is required"],
    trim: true,
    maxlength: [50, "MainGroup name cannot exceed 50 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// SubGroup Schema
const subGroupSchema = new mongoose.Schema({
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
  // نام گروه فرعی
  name: {
    type: String,
    required: [true, "Subgroup name is required"],
    trim: true,
    maxlength: [50, "Subgroup name cannot exceed 50 characters"],
    unique: true,
  },
  // نام گروه اصلی که این گروه فرعی به آن مرتبط است
  mainGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductGroup",
    required: [true, "Subgroup must belong to a main group"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Main Product Group Schema
const productGroupSchema = new mongoose.Schema({
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
  // نام گروه کالایی
  name: {
    type: String,
    required: [true, "Product Group name is required"],
    trim: true,
    maxlength: [50, "Product Group name cannot exceed 50 characters"],
    unique: true,
  },
  //  گروه اصلی
  mainGroup: {
    type: mongoose.Schema.ObjectId,
    ref: "MainGroup",
  },
  //  گروه فرعی
  subGroup: {
    type: mongoose.Schema.ObjectId,
    ref: "SubGroup",
  },
  // هشتگ
  hashtag: {
    type: String,
    trim: true,
    maxlength: [30, "Hashtag cannot exceed 30 characters"],
  },
});

// Virtual populate - Get all subgroups for a main group
productGroupSchema.virtual("subGroups", {
  ref: "SubGroup",
  localField: "_id",
  foreignField: "mainGroup",
  justOne: false,
});

// Ensure virtuals are included when converting to JSON/Object
productGroupSchema.set("toJSON", { virtuals: true });
productGroupSchema.set("toObject", { virtuals: true });

// Indexes for better performance
productGroupSchema.index({ name: 1 });
subGroupSchema.index({ name: 1 });
subGroupSchema.index({ mainGroup: 1 });

const MainGroup = mongoose.model("MainGroup", mainGroupSchema);
const SubGroup = mongoose.model("SubGroup", subGroupSchema);
const ProductGroup = mongoose.model("ProductGroup", productGroupSchema);

const secondaryUnitSchema = new mongoose.Schema({
  // واحد شمارش واحد فرعی
  countingUnit: {
    type: String,
    trim: true,
    maxlength: [20, "Counting unit cannot exceed 20 characters"],
  },
  // ضریب واحد فرعی
  subunitRatio: {
    type: Number,
    min: [0.01, "Subunit ratio must be greater than 0"],
  },
  // موجودی اولیه کالا (واحد اصلی)
  initialInventoryMainUnit: {
    type: Number,
    default: 0,
    min: [0, "initial Inventory Main Unit cannot be negative"],
  },
  // موجودی اولیه کالا (واحد فرعی)
  initialInventorySubUnit: {
    type: Number,
    default: 0,
    min: [0, "initial Inventory SubUnit cannot be negative"],
  },
  // قیمت خرید (واحد اصلی)
  purchasePriceMainUnit: {
    type: Number,
    default: 0,
    min: [0, "Purchase price cannot be negative"],
  },
  // قیمت خرید (واحد فرعی)
  purchasePriceSubUnit: {
    type: Number,
    default: 0,
    min: [0, "Purchase price cannot be negative"],
  },
  // قیمت فروش (واحد اصلی)
  sellingPriceMainUnit: {
    type: Number,
    default: 0,
    min: [0, "Selling price cannot be negative"],
  },
  // قیمت فروش (واحد فرعی)
  sellingPriceSubUnit: {
    type: Number,
    default: 0,
    min: [0, "Selling price cannot be negative"],
  },
  // قیمت فروش دوم (واحد اصلی)
  secondSellingPriceMainUnit: {
    type: Number,
    default: 0,
    min: [0, "Second selling price cannot be negative"],
  },
  // قیمت فروش دوم (واحد فرعی)
  secondSellingPriceSubUnit: {
    type: Number,
    default: 0,
    min: [0, "Second selling price cannot be negative"],
  },
});

const moreInfoSchema = new mongoose.Schema({
  // اطلاعات بیشتر
  additionalInformation: {
    type: String,
    trim: true,
    maxlength: [500, "Additional information cannot exceed 500 characters"],
  },
  // شرح در فاکتور
  factorDescription: {
    type: String,
    trim: true,
    maxlength: [200, "Factor description cannot exceed 200 characters"],
  },
  // بارکد
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
  // حداقل روز برای هشدار تاریخ انقضا
  minExpireWarningDays: {
    type: Number,
    min: [0, "Minimum expire warning days cannot be negative"],
  },
  // حداقل موجودی کالا
  minStock: {
    type: Number,
    min: [0, "Minimum stock cannot be negative"],
  },
  // درصد مالیات بر ارزش افزوده
  vatPercent: {
    type: Number,
    min: [0, "VAT percentage cannot be negative"],
    max: [100, "VAT percentage cannot exceed 100%"],
  },
  // وزن
  weight: {
    type: Number,
    min: [0, "Weight cannot be negative"],
  },
  // طول
  length: {
    type: Number,
    min: [0, "Length cannot be negative"],
  },
  // عرض
  width: {
    type: Number,
    min: [0, "Width cannot be negative"],
  },
  // ارتفاع
  height: {
    type: Number,
    min: [0, "Height cannot be negative"],
  },
});

const productSchema = new mongoose.Schema(
  {
    // تصویر کالا
    image: {
      type: String,
    },
    // فروشنده
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
    // نام کالا
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: [3, "Product title must be at least 3 characters"],
      maxlength: [50, "Product title cannot exceed 50 characters"],
    },
    // کد کالا
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
    // گروه کالایی
    productGroup: {
      type: productGroupSchema,
      required: [true, "Product group is required"],
    },
    // واحد شمارش
    countingUnit: {
      type: String,
      required: [true, "Counting unit is required"],
      trim: true,
      maxlength: [20, "Counting unit cannot exceed 20 characters"],
    },
    // بررسی داشتن یا نداشتن واحد فرعی
    hasSecondUnit: {
      type: Boolean,
      default: false,
    },

    // موجودی اولیه کالا (واخد)
    initialInventory: {
      type: Number,
      default: 0,
      min: [0, "initial Inventory Main Unit cannot be negative"],
    },
    // قیمت خرید
    purchasePrice: {
      type: Number,
      default: 0,
      min: [0, "Purchase price cannot be negative"],
    },
    // قیمت فروش
    sellingPrice: {
      type: Number,
      default: 0,
      min: [0, "Selling price cannot be negative"],
    },
    // قیمت فروش دوم
    secondSellingPrice: {
      type: Number,
      default: 0,
      min: [0, "Second selling price cannot be negative"],
    },

    // (در صورت وجود واحد فرعی) واحد فرعی
    secondaryUnit: secondaryUnitSchema,
    moreInfo: moreInfoSchema,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Fix the model name (it was incorrectly exporting as 'User')
const Product = mongoose.model("Product", productSchema);

module.exports = {
  MainGroup,
  SubGroup,
  ProductGroup,
  Product,
};
