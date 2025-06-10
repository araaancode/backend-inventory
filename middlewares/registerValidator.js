// middlewares/registerValidator.js
const { body } = require('express-validator');
const User = require('../models/User');

const registerValidations = [
  // Store Name validation
  body('storeName')
    .notEmpty().withMessage('نام فروشگاه الزامی است')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('نام فروشگاه باید بین ۲ تا ۵۰ کاراکتر باشد'),
    
  // Username validation
  body('username')
    .notEmpty().withMessage('نام کاربری الزامی است')
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('نام کاربری باید بین ۳ تا ۲۰ کاراکتر باشد')
    .custom(async (username) => {
      const user = await User.findOne({ username });
      if (user) throw new Error('این نام کاربری قبلا ثبت شده است');
      return true;
    }),
    
  // Phone validation (Iranian mobile)
  body('phone')
    .notEmpty().withMessage('شماره موبایل الزامی است')
    .matches(/^09\d{9}$/).withMessage('شماره موبایل معتبر نیست')
    .custom(async (phone) => {
      const user = await User.findOne({ phone });
      if (user) throw new Error('این شماره موبایل قبلا ثبت شده است');
      return true;
    }),
    
  // Password validation
  body('password')
    .notEmpty().withMessage('رمز عبور الزامی است')
    .isLength({ min: 8 }).withMessage('رمز عبور باید حداقل ۸ کاراکتر باشد')
    .matches(/[A-Z]/).withMessage('رمز عبور باید حداقل یک حرف بزرگ داشته باشد')
    .matches(/[a-z]/).withMessage('رمز عبور باید حداقل یک حرف کوچک داشته باشد')
    .matches(/\d/).withMessage('رمز عبور باید حداقل یک عدد داشته باشد'),
    
  // Password confirmation
  body('passwordConfirm')
    .notEmpty().withMessage('تکرار رمز عبور الزامی است')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('تکرار رمز عبور با رمز عبور مطابقت ندارد');
      }
      return true;
    })
];

module.exports = registerValidations;