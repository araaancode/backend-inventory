// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title:{  // نام محصول
        type:String,
        requried:true,
        trim:true,
        min:3,
        max:50
    },
    description:{ // توضیحات محصول
        type:String,
        requried:true,
        trim:true,
        min:20,
        max:350
    },
    photo:{ // عکس محصول
        type:String,
    },
    photos:{ // عکس های محصول
        type:String,
    }, 
    productCode:{  // کد کالا
        type:String,
    },
    mainCategory:{  // گروه اصلی
        type:String,
    },
    subCategory:{  // گروه فعلی
        type:String,
    },
    hashtags:{  // هشتگ ها
        type:String,
    },
    unit:{ // واحد شمارش
        type:String,
    },
    hasSecondaryUnit:{ // بررسی وجود واحد فرعی
        type:Boolean,
    },
    secondaryUnit:{ // واحد فرعی
        type:String,
    },
    secondaryUnitRatio:{ // ضریب شمارش واحد فرعی
        type:String,
    },
   
    initialStock:{ // موجودی اولیه واحد اصلی
        type:String,
    },
    initialSecondaryStock:{ // موجودی اولیه واحد فرعی
        type:String,
    },
    purchasePrice:{ // قیمت خرید واحد اصلی
        type:String,
    },
    sellPrice:{ // قیمت فروش واحد اصلی
        type:String,
    },
    purchasePriceSecondary:{  // قیمت خرید واحد فرعی
        type:String,
    },
    sellPriceSecondary:{  // قیمت فروش واحد فرعی
        type:String,
    },
   
    secondSellPrice:{ // قیمت فروش دوم واحد اصلی
        type:String,
    },
    secondSellPriceSecondary:{ // قیمت فروش دوم واحد فرعی
        type:String,
    },
    invoiceDescription:{  // شرح فاکتور
        type:String,
    },
    barcode:{ // بارکد
        type:String,
    },
    minExpireWarningDays:{ // حداقل روز برای هشدار تاریخ انقضا
        type:String,
    },
    minStock:{  // حداقل موجوی کالا
        type:String,
    },
    vatPercent:{  // درصد مالیات بر ارزش افزوده
        type:String,
    },
    weight:{ // وزن به گرم
        type:String,
    },
    length:{ // طول به میلی متر
        type:String,
    },
    width:{ // عرض به میلی متر
        type:String,
    },
    height:{ // ارتفاع به میلی متر
        type:String,
    },
    moreInfo:{ // اطلاعات اضافی
        type:String,
    },
    
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
