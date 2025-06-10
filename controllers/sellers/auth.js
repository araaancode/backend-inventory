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
