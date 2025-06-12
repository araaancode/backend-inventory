const mongoose = require("mongoose");
const validator = require("validator");

const financialFundSchema = new mongoose.Schema(
  {
    // ایجاد کننده
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "ایجاد کننده الزامی است"],
      validate: {
        validator: async function (value) {
          // First check if the ID is valid to avoid unnecessary DB queries
          if (!mongoose.Types.ObjectId.isValid(value)) return false;
          // Only fetch the _id field for efficiency
          const user = await mongoose.model("User").findById(value).select('_id');
          return !!user;
        },
        message: "ایجاد کننده معتبر نیست",
      },
      index: true,
    },
    // نام صندوق
    fundName: {
      type: String,
      trim: true, 
      maxlength: [100, "نام صندوق نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"],
      validate: {
        validator: function (value) {
          return value && value.trim().length >= 2; // Ensure non-empty and meaningful
        },
        message: "نام صندوق باید حداقل ۲ کاراکتر داشته باشد",
      },
    },
    // موجودی اولیه
    initialStock: {
      type: Number,
      min: [0, "مقدار سهام نمی‌تواند منفی باشد"],
    },
    // اطلاعات بیشتر
    moreInfo: {
      type: String,
      trim: true,
      maxlength: [500, "توضیحات نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد"],
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


module.exports = mongoose.model("FinancialFund", financialFundSchema);