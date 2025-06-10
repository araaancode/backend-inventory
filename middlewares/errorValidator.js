// middlewares/errorValidator.js
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Clean up uploaded file if validation fails
    if (req.file) {
      require('fs').unlinkSync(req.file.path);
    }
    
    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({
      status: 'failure',
      msg: 'خطا در اعتبارسنجی',
      errors: errorMessages
    });
  }
  next();
};

module.exports = validate;