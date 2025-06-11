const mongoose = require("mongoose");
const validator = require("validator");

const costSchema = new mongoose.Schema(
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
    image:{
      type:String
    },
    // عنوان هزینه
    costTitle: {
      type: String,
      required: [true, "عنوان هزینه الزامی است"],
      trim: true,
      minlength: [3, "عنوان هزینه باید حداقل ۳ کاراکتر باشد"],
      maxlength: [100, "عنوان هزینه نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"],
      validate: {
        validator: function (v) {
          return /^[\u0600-\u06FFa-zA-Z0-9\s\-_،.]+$/.test(v);
        },
        message:
          "عنوان هزینه فقط می‌تواند شامل حروف، اعداد و علائم نگارشی باشد",
      },
    },
    // واحد شمارش
    countingRatio: {
      type: String,
      trim: true,
    },
    //  قیمت
    price: {
      type: String,
      required: [true, "مبلغ الزامی است"],
      validate: {
        validator: function (v) {
          return /^[0-9,]+$/.test(v);
        },
        message:
          "مبلغ باید به صورت عددی و با کاما برای جداکننده هزارگان وارد شود",
      },
    },
    // اطلاعات بیشتر
    moreInfo: {
      type: String,
      trim: true,
      maxlength: [500, "اطلاعات بیشتر نمی‌تواند بیش از ۵۰۰ کاراکتر باشد"],
    },
    // شرح در فاکتور
    factorDescription: {
      type: String,
      trim: true,
      maxlength: [200, "توضیحات فاکتور نمی‌تواند بیش از ۲۰۰ کاراکتر باشد"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add text index for search functionality
costSchema.index({ costTitle: "text", factorDescription: "text" });

module.exports = mongoose.model("Cost", costSchema);
