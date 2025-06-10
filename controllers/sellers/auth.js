const crypto = require("crypto");
const moment = require("moment");
const randKey = require("random-key");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

// # description -> HTTP VERB -> Accesss
// # register seller -> POST -> sellers
exports.register = async (req, res) => {
  try {
    const avatarPath = req.file
      ? req.file.path.replace("public", "")
      : undefined;

    const newSeller = await User.create({
      storeName: req.body.storeName,
      username: req.body.username,
      phone: req.body.phone,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: "seller",
      avatar: avatarPath || "default.jpg",
    });

    const token = jwt.sign(
      { id: newSeller._id, role: newSeller.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Prepare response without sensitive data
    const { password, passwordConfirm, __v, ...sellerData } =
      newSeller.toObject();

    return res.status(201).json({
      status: "success",
      msg: "ثبت نام فروشنده با موفقیت انجام شد",
      seller: sellerData,
      token,
    });
  } catch (error) {
    if (req.file) require("fs").unlinkSync(req.file.path);

    console.error("ثبت نام فروشنده با خطا مواجه شد:", error);
    return res.status(500).json({
      status: "failure",
      msg: "خطای سرور در هنگام ثبت نام",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


// # description -> HTTP VERB -> Accesss
// # login seller -> POST -> sellers
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // 1. Find user by username or phone
    const user = await User.findOne({
      $or: [{ username: identifier }, { phone: identifier }],
    }).select("+password"); // Include password for verification

    // 2. Check if user exists
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "failure",
        msg: "کاربری با این مشخصات یافت نشد",
      });
    }

    // 3. Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "failure",
        msg: "رمز عبور نادرست است",
      });
    }

    // 4. Check if account is active
    if (!user.isActive) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: "failure",
        msg: "حساب کاربری غیرفعال شده است",
      });
    }

    // 5. Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        iat: Math.floor(Date.now() / 1000), // issued at
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        algorithm: "HS256",
      }
    );

    // 6. Prepare user data without sensitive fields
    const userData = user.toObject();
    delete userData.password;
    delete userData.passwordConfirm;
    delete userData.__v;
    delete userData.passwordResetToken;
    delete userData.passwordResetExpires;

    // 7. Set cookie (optional)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(StatusCodes.OK).json({
      status: "success",
      msg: "ورود موفقیت‌آمیز بود",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("خطا در ورود:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای سرور در هنگام ورود",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


// # description -> HTTP VERB -> Accesss
// # login guest -> POST -> guests
exports.loginGuest = async (req, res) => {
  try {
    // 1. Generate device ID or use provided one
    const deviceId = req.body.deviceId || `guest_${crypto.randomBytes(8).toString('hex')}`;
    const guestPrefix = `guest_${deviceId.slice(0, 6)}`;
    const fakePhone = `09${crypto.randomBytes(4).toString('hex').slice(0, 8)}`; // Valid Iranian format

    // 2. Create guest user without modifying schema
    const guestUser = await User.findOneAndUpdate(
      { 
        $or: [
          { deviceId }, // For existing guests
          { username: guestPrefix } // Fallback for legacy guests
        ],
        role: 'customer'
      },
      {
        $setOnInsert: {
          storeName: `GuestStore_${deviceId.slice(0,4)}`,
          username: guestPrefix,
          phone: fakePhone,
          password: crypto.randomBytes(16).toString('hex'), // Hashed by pre-save hook
          passwordConfirm: crypto.randomBytes(16).toString('hex'), // Temporary bypass
          role: 'customer',
          isActive: true,
          deviceId // Will be saved despite not being in schema (non-strict)
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        strict: false // Allows saving deviceId temporarily
      }
    );

    // 3. Clean up temporary fields
    if (guestUser.isNew) {
      guestUser.passwordConfirm = undefined;
      await guestUser.save({ validateBeforeSave: false });
    }

    // 4. Generate token (matches your existing auth system)
    const token = jwt.sign(
      {
        id: guestUser._id,
        role: guestUser.role,
        isGuest: true, // Custom flag for frontend
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        algorithm: 'HS256'
      }
    );

    // 5. Prepare response (respects schema's select:false)
    const responseData = {
      _id: guestUser._id,
      role: guestUser.role,
      isGuest: true,
      avatar: guestUser.avatar || 'default.jpg',
      storeName: guestUser.storeName,
      createdAt: guestUser.createdAt,
      deviceId // Returned but not stored long-term
    };

    return res.status(StatusCodes.OK).json({
      status: 'success',
      msg: 'ورود مهمان موفقیت‌آمیز بود',
      token,
      user: responseData
    });

  } catch (error) {
    console.error('Guest login error:', error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({
        status: 'failure',
        msg: 'این دستگاه قبلاً ثبت شده است',
        solution: 'ارسال deviceId متفاوت یا استفاده از ورود معمولی'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'failure',
        msg: 'خطا در داده‌های مهمان',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'failure',
      msg: 'خطای سرور در ورود مهمان',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};