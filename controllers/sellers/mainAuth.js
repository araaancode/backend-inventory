const crypto = require("crypto");
const moment = require("moment");
const randKey = require("random-key");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const {
  sendForgotPasswordEmail,
  sendOtpEmailUtil,
  sendSuccessResetPasswordEmail,
} = require("../../utils/sendMail");
const sendOTPUtil = require("../../utils/sendOTP");
const User = require("../../models/User");
const Token = require("../../models/Token");
const OTP = require("../../models/OTP");

// Regular expression for Iranian phone numbers
const OTP_EXPIRE_MINUTES = 2;
const IRAN_PHONE_REGEX = /^(?:(?:09[1-9]\d{8})|(۰۹[۱-۹]\d{8}))$/;


// # description -> HTTP VERB -> Accesss
// # sign token function -> No HTTP VERB -> users
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// # description -> HTTP VERB -> Accesss
// # send OTP Code -> POST -> users
const sendOTPCodeToPhoneHandler = async (phone, user, req, res) => {
  const code = randKey.generateDigits(5);
  const otpExpiresAt = moment().add(OTP_EXPIRE_MINUTES, "minutes").toDate();

  try {
    let otp = await OTP.findOne({ phone });

    if (otp) {
      // Update existing OTP
      otp.code = code;
      otp.otpExpiresAt = otpExpiresAt;
      const updatedOtp = await otp.save();

      if (updatedOtp) {
        sendOTPUtil(updatedOtp.code, phone);
        return res.status(StatusCodes.CREATED).json({
          msg: "کد تایید ارسال شد",
          data: updatedOtp,
        });
      }
    } else {
      // Create new OTP
      const newOtp = await OTP.create({
        phone,
        code,
        otpExpiresAt,
      });

      if (newOtp) {
        sendOTPUtil(newOtp.code, phone);
        return res.status(StatusCodes.CREATED).json({
          msg: "کد تایید جدید ساخته شد",
          code: newOtp,
        });
      }
    }

    // Fallback error if neither condition is met
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "عملیات ناموفق بود",
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "خطا در پردازش درخواست",
      error: error.message, // Better to send only the message in production
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # send OTP Code -> POST -> users
const sendOTPCodeToEmailHandler = async (email, user, req, res) => {
  const code = randKey.generateDigits(5);
  let otp = await OTP.findOne({ email });
  const otpExpiresAt = moment().add(OTP_EXPIRE_MINUTES, "minutes").toDate();
  let data = {
    name: user.firstName + " " + user.lastName,
    email,
  };

  if (otp) {
    otp.code = code;
    otp.otpExpiresAt = otpExpiresAt;
    otp
      .save()
      .then((data) => {
        if (data) {
          sendOtpEmailUtil(data, otp.code, email, req, res);
          res.status(StatusCodes.CREATED).json({
            msg: "کد تایید ارسال شد",
            data,
          });
        }
      })
      .catch((error) => {
        console.log(error);

        res.status(StatusCodes.BAD_REQUEST).json({
          msg: "کد تایید ارسال نشد",
          error,
        });
      });
  } else {
    let newOtp = await OTP.create({
      email: email,
      code,
      otpExpiresAt,
    });

    if (newOtp) {
      sendOtpEmailUtil(data, newOtp.code, req, res);

      res.status(StatusCodes.CREATED).json({
        msg: "کد تایید جدید ساخته شد",
        code: newOtp,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "کد تایید ساخته نشد",
      });
    }
  }
};

// # description -> HTTP VERB -> Accesss
// # create Send Token function -> No HTTP VERB -> users
const createSendToken = (user, statusCode, statusMsg, msg, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: statusMsg,
    msg,
    token,
    data: {
      user,
    },
  });
};

// # description -> HTTP VERB -> Accesss
// # register user -> POST -> users
exports.register = async (req, res) => {
  try {
    const { storeName, username, phone, password, passwordConfirm } = req.body;

    // 1. Basic validation
    if (!storeName || !username || !phone || !password || !passwordConfirm) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "تمام فیلدها باید وارد شوند",
        missingFields: {
          storeName: !storeName,
          username: !username,
          phone: !phone,
          password: !password,
          passwordConfirm: !passwordConfirm
        }
      });
    }

    // 2. Check if user exists (both phone and username)
    const existingUser = await User.findOne({
      $or: [{ phone }, { username }]
    });

    if (existingUser) {
      const conflictField = existingUser.phone === phone ? "phone" : "username";
      return res.status(StatusCodes.CONFLICT).json({
        status: "failure",
        msg: `کاربر با این ${conflictField === "phone" ? "شماره تلفن" : "نام کاربری"} موجود است`,
        conflictField
      });
    }

    // 3. Create new seller (let Mongoose handle passwordConfirm validation)
    const newSeller = await User.create({
      storeName,
      username,
      phone,
      password,
      passwordConfirm,
      role: "seller"
    });

    // 4. Generate JWT token (with additional security checks)
    const token = jwt.sign(
      {
        id: newSeller._id,
        role: newSeller.role,
        iat: Math.floor(Date.now() / 1000) // issued at
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        algorithm: "HS256"
      }
    );

    // 5. Prepare response (remove sensitive data)
    const sellerResponse = {
      _id: newSeller._id,
      storeName: newSeller.storeName,
      username: newSeller.username,
      phone: newSeller.phone,
      role: newSeller.role,
      avatar: newSeller.avatar,
      createdAt: newSeller.createdAt
    };

    return res.status(StatusCodes.CREATED).json({
      status: "success",
      msg: "فروشنده با موفقیت ثبت نام شد",
      seller: sellerResponse,
      token
    });

  } catch (error) {
    // Handle Mongoose validation errors specifically
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(el => el.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "خطا در اعتبارسنجی داده‌ها",
        errors: process.env.NODE_ENV === "development" ? errors : undefined
      });
    }

    console.error("خطا در ثبت نام فروشنده:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای سرور در هنگام ثبت نام",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # login user -> POST -> users
exports.login = async (req, res, next) => {
  try {
    const { login, password } = req.body;

    // Validate required fields
    if (!login || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "نام کاربری/شماره موبایل و رمز عبور الزامی هستند",
      });
    }

    // Sanitize input
    const trimmedLogin = login.trim();
    const normalizedLogin = trimmedLogin.replace(/[\s-]/g, "");

    // Determine if login is phone or username
    let isPhone = false;
    let query = {};

    // Check if input matches phone pattern (English or Persian numbers)
    const persianToEnglish = normalizedLogin.replace(/[۰-۹]/g, (d) =>
      "۰۱۲۳۴۵۶۷۸۹".indexOf(d)
    );
    if (IRAN_PHONE_REGEX.test(persianToEnglish)) {
      isPhone = true;
      query.phone = persianToEnglish;
    } else {
      // Treat as username
      query.username = trimmedLogin.toLowerCase();
    }

    // Find user with password field
    const user = await User.findOne(query).select("+password");

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "failure",
        msg: isPhone
          ? "کاربری با این شماره موبایل یافت نشد"
          : "کاربری با این نام کاربری یافت نشد",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!user.matchPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "failure",
        msg: "رمز عبور نادرست است",
      });
    }

    // Prepare user data without sensitive information
    const userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      phone: user.phone,
      createdAt: user.createdAt,
    };

    // Successful login
    return res.status(StatusCodes.OK).json({
      status: "success",
      msg: "ورود با موفقیت انجام شد",
      data: {
        user: userData,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای سرور در هنگام ورود",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # send Otp To phone -> POST -> users
exports.sendOtpToPhone = async (req, res) => {
  const { phone } = req.body;

  // Validate input
  if (!phone) {
    return res.status(400).json({
      success: false,
      msg: "شماره همراه ضروری است",
    });
  }

  // Validate phone format
  const phoneRegex = /^09\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      msg: "شماره وارد شده نامعتبر است. باید شبیه به",
    });
  }

  try {
    // Delete any existing OTP for this phone
    await OTP.deleteMany({ phone });

    // Generate new OTP
    const otpCode = OTP.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Create and save OTP record
    const otpRecord = new OTP({
      phone,
      code: otpCode,
      otpExpiresAt,
    });

    await otpRecord.save();

    try {
      sendOTPUtil(otpCode, phone);
    } catch (smsError) {
      console.error("SMS sending failed:", smsError);
      await OTP.deleteOne({ phone }); // Clean up if SMS fails
      return res.status(500).json({
        success: false,
        msg: "Failed to send OTP via SMS",
        error: smsError.message,
      });
    }

    return res.status(200).json({
      success: true,
      msg: "OTP sent successfully",
      phone,
      expiresAt: otpExpiresAt,
    });
  } catch (error) {
    console.error("Error in sendPhoneOTP:", error);

    // Handle specific error cases
    if (error.name === "MongoError" && error.code === 11000) {
      return res.status(400).json({
        success: false,
        msg: "OTP already exists for this phone",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        msg: error.message,
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      msg: "Failed to send OTP",
      error: error.message,
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # send Otp To email -> POST -> users
exports.sendOtpToEmail = async (req, res) => {
  try {
    let { email } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      await sendOTPCodeToEmailHandler(email, user, req, res);
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "کاربر با چنین ایمیلی یافت نشد",
      });
    }
  } catch (error) {
    console.error(error.message);
  }
};

//
// @desc    Verify OTP code for phone
// @route   POST /api/users/auth/verify-otp
// @access  Public
exports.verifyPhoneOTP = async (req, res, next) => {
  try {
    const { phone, code } = req.body;

    // Validate input
    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        msg: "شماره همراه و کد تایید ضروری است",
      });
    }

    // Validate phone format
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        msg: "شماره همراه نامعتبر است",
      });
    }

    // Find the OTP record
    const otpRecord = await OTP.findOne({ phone });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        msg: "کد تایید یا منقضی شده یا وجود ندارد",
      });
    }

    // Verify the OTP
    const isVerified = await otpRecord.verifyOTP(code);

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        msg: "کد تایید نامعتبر یا منقضی شده",
      });
    }

    // Mark OTP as used
    await otpRecord.save();

    let user = await User.findOne({ phone });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role || "user", // Include role if exists
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(200).json({
      success: true,
      msg: "کد تایید وارد شده درست است",
      phone,
      token,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      msg: "خطا در اعتبارسنجی کد تایید",
      error: error.message,
    });
  }
};

//
// @desc    Resend phone OTP
// @route   POST /api/users/auth/resend-otp
// @access  Public
exports.resendPhoneOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    // Required field check (with Persian message)
    if (!phone) {
      return res.status(400).json({
        success: false,
        msg: "شماره همراه ضروری است", // Phone number is required
      });
    }

    // Phone format validation
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        msg: "شماره وارد شده نامعتبر است.",
      });
    }

    // Delete existing OTPs
    await OTP.deleteMany({ phone });

    // Generate new OTP
    const newOTP = OTP.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Create and save new OTP
    const otpRecord = new OTP({
      phone,
      code: newOTP,
      otpExpiresAt,
    });

    await otpRecord.save();

    sendOTPUtil(newOTP, phone);

    res.status(200).json({
      success: true,
      msg: "کد تایید جدید ساخته شد",
      phone,
      expiresAt: otpExpiresAt,
      // Don't include OTP in production
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      msg: "خطا در ارسال مجدد کت تایید",
      error: error.message,
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # logout -> GET -> users
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

// # description -> HTTP VERB -> Accesss
// # forgot password -> POST -> users
exports.forgotPassword = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      let token = user.token;

      if (token) {
        user.token = "";
        await user.save();
      } else {
        let newToken = crypto.randomBytes(32).toString("hex");
        let hashedToken = await bcrypt.hash(newToken, 12);

        let link = `${process.env.currentURL}/reset-password?token=${newToken}&userId=${user._id}`;
        sendForgotPasswordEmail(user, link);

        user.token = hashedToken;
        await user
          .save()
          .then((data) => {
            if (data) {
              res.status(201).json({ msg: "لطفا ایمیل خود را بررسی کنید" });
            }
          })
          .catch((err) => {
            res.status(403).json({ msg: "مشکل در فرستادن ایمیل", err });
          });
      }
    } else {
      res.status(404).json({
        msg: "چنین ایمیلی وجود ندارد",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(403).json({
      msg: "خطایی وجود دارد، دوباره امتحان کنید",
      error,
      msgCode: 3,
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # reset password -> POST -> users
exports.resetPassword = async (req, res) => {
  try {
    const { userId, token, password, passwordConfirm } = req.body;

    // Validate input
    if (!userId || !token || !password || !passwordConfirm) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "تمام فیلدهای الزامی را پر کنید",
      });
    }

    if (password !== passwordConfirm) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "گذرواژه و تأیید گذرواژه مطابقت ندارند",
      });
    }

    // Find user and validate token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "کاربر یافت نشد",
      });
    }

    if (!user.token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "توکن بازنشانی گذرواژه وجود ندارد یا منقضی شده است",
      });
    }

    const isValidToken = await bcrypt.compare(token, user.token);
    if (!isValidToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "توکن بازنشانی گذرواژه نامعتبر یا منقضی شده است",
      });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.token = undefined; // Clear the reset token
    await user.save();

    // Send confirmation email
    const loginLink = `${process.env.CURRENT_URL}/login`;
    await sendSuccessResetPasswordEmail(user, loginLink);

    return res.status(StatusCodes.OK).json({
      msg: "گذرواژه با موفقیت تغییر کرد",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای سرور داخلی",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
