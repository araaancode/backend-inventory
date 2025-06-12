const mongoose = require("mongoose");
const validator = require("validator");

const paycheckSchema = new mongoose.Schema(
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
          const user = await mongoose
            .model("User")
            .findById(value)
            .select("_id");
          return !!user;
        },
        message: "ایجاد کننده معتبر نیست",
      },
      index: true,
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
      sparse:true
    },

    // دریافتی به مبلغ
    receiptPrice: {
      type: Number,
      required: [true, "مبلغ دریافتی الزامی است"],
    },
    // صندوق اولیه
    financialFund: {
      type: mongoose.Schema.ObjectId,
      ref: "FinancialFund",
      validate: {
        validator: async function (value) {
          if (!value) return true;
          const fund = await mongoose.model("FinancialFund").findById(value);
          return !!fund;
        },
        message: "صندوق مالی معتبر نیست",
      },
    },
    // روش پرداخت
    checkoutMethod: {
      type: String,
      trim: true,
      enum: {
        values: ["نقدی", "چک", "کارت به کارت", "حواله"],
        message: "روش پرداخت معتبر نیست",
      },
    },
    // اطلاعات بیشتر
    moreInfo: {
      type: String,
      trim: true,
      maxlength: [500, "توضیحات بیشتر نمی‌تواند بیش از ۵۰۰ کاراکتر باشد"],
    },
    // تاریخ دریافت
    receiptDate: {
      type: Date,
      required: [true, "تاریخ رسید الزامی است"],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "تاریخ رسید نمی‌تواند در آینده باشد",
      },
    },
    // نوع
    paycheckType: {
      type: String,
      trim: true,
      required: [true, "نوع الزامی است"],
      enum: [
        "receipt", // دریافتی
        "pay", // پرداختی
      ],
    },

    image:{
      type:String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for better performance
paycheckSchema.index({ payer: 1 });
paycheckSchema.index({ recipient: 1 });
paycheckSchema.index({ receipt: 1 }, { unique: true });
paycheckSchema.index({ receiptDate: -1 });

module.exports = mongoose.model("Paycheck", paycheckSchema);
