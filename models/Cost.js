const mongoose = require('mongoose');
const validator = require('validator');

const costSchema = new mongoose.Schema(
  {
    costTitle: {
      type: String,
      required: [true, 'عنوان هزینه الزامی است'],
      trim: true,
      minlength: [3, 'عنوان هزینه باید حداقل ۳ کاراکتر باشد'],
      maxlength: [100, 'عنوان هزینه نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'],
      validate: {
        validator: function(v) {
          return /^[\u0600-\u06FFa-zA-Z0-9\s\-_،.]+$/.test(v);
        },
        message: 'عنوان هزینه فقط می‌تواند شامل حروف، اعداد و علائم نگارشی باشد'
      }
    },
    countingRatio: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^[0-9\/]+$/.test(v);
        },
        message: 'نسبت شمارش باید عدد یا کسر باشد (مثال: 1 یا 1/2)'
      }
    },
    price: {
      type: String,
      required: [true, 'مبلغ الزامی است'],
      validate: {
        validator: function(v) {
          return /^[0-9,]+$/.test(v);
        },
        message: 'مبلغ باید به صورت عددی و با کاما برای جداکننده هزارگان وارد شود'
      }
    },
    moreInfo: {
      type: String,
      trim: true,
      maxlength: [500, 'اطلاعات بیشتر نمی‌تواند بیش از ۵۰۰ کاراکتر باشد']
    },
    factorDescription: {
      type: String,
      trim: true,
      maxlength: [200, 'توضیحات فاکتور نمی‌تواند بیش از ۲۰۰ کاراکتر باشد']
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add text index for search functionality
costSchema.index({ costTitle: 'text', factorDescription: 'text' });

module.exports = mongoose.model('Cost', costSchema);