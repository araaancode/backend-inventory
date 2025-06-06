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
const MIN_PASSWORD_LENGTH = 8;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;


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
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, username, password } = req.body;

    // Input sanitization
    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();
    const trimmedUsername = username?.trim();
    const trimmedPhone = phone?.trim().replace(/[\s-]/g, "");

    // Validate required fields
    if (!trimmedFirstName || !trimmedLastName) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        message: "نام و نام خانوادگی الزامی هستند",
      });
    }

    if (!password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        message: "رمز عبور الزامی است",
      });
    }

    // Validate either username or phone (exclusive)
    if (trimmedUsername && trimmedPhone) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        message: "لطفاً فقط شماره موبایل یا نام کاربری وارد کنید",
      });
    }

    if (!trimmedUsername && !trimmedPhone) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        message: "وارد کردن شماره موبایل یا نام کاربری الزامی است",
      });
    }

    // Validate username format
    if (trimmedUsername) {
      if (trimmedUsername.length < USERNAME_MIN_LENGTH) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          message: `نام کاربری باید حداقل ${USERNAME_MIN_LENGTH} کاراکتر باشد`,
        });
      }

      if (trimmedUsername.length > USERNAME_MAX_LENGTH) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          message: `نام کاربری نمی‌تواند بیشتر از ${USERNAME_MAX_LENGTH} کاراکتر باشد`,
        });
      }

      if (!USERNAME_REGEX.test(trimmedUsername)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          message:
            "نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و زیرخط باشد",
        });
      }
    }

    // Validate phone format (Iranian format)
    if (trimmedPhone) {
      // Convert Persian numbers to English if needed
      const normalizedPhone = trimmedPhone.replace(/[۰-۹]/g, (d) =>
        "۰۱۲۳۴۵۶۷۸۹".indexOf(d)
      );

      if (!IRAN_PHONE_REGEX.test(normalizedPhone)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          message: "شماره موبایل معتبر نیست. فرمت صحیح: 09123456789",
        });
      }
    }

    // Validate password strength
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        message: `رمز عبور باید حداقل ${MIN_PASSWORD_LENGTH} کاراکتر باشد`,
      });
    }

    // Check if user exists by phone or username
    const existingUser = await User.findOne({
      $or: [
        ...(trimmedUsername ? [{ username: trimmedUsername }] : []),
        ...(trimmedPhone ? [{ phone: trimmedPhone }] : []),
      ],
    });

    if (existingUser) {
      const field = existingUser.username ? "نام کاربری" : "شماره موبایل";
      return res.status(StatusCodes.CONFLICT).json({
        status: "failure",
        message: `کاربری با این ${field} قبلاً ثبت‌نام کرده است`,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const userData = {
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      password: hashedPassword,
      ...(trimmedUsername && { username: trimmedUsername }),
      ...(trimmedPhone && { phone: trimmedPhone }),
    };

    const newUser = await User.create(userData);

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    // Remove sensitive data before sending response
    const userResponse = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
      phone: newUser.phone,
      createdAt: newUser.createdAt,
    };

    // Successful response
    return res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "ثبت‌نام با موفقیت انجام شد",
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "خطای سرور در هنگام ثبت‌نام",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # login user -> POST -> users
exports.login = async (req, res, next) => {
  try {
    const email = req.body.email?.trim();
    const phone = req.body.phone?.trim();
    const password = req.body.password.trim();

    // Validate input (exclusive email or phone)
    if (!email && !phone) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        message: "لطفاً ایمیل یا شماره موبایل خود را وارد کنید",
        hint: "برای ورود باید یکی از روش‌های احراز هویت را انتخاب کنید",
      });
    }

    if (email && phone) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        message: "لطفاً فقط از یک روش برای ورود استفاده کنید",
        details: {
          solution: "فقط ایمیل یا فقط شماره موبایل ارسال شود",
        },
      });
    }

    // Determine identifier type and validate format
    let identifierType, identifierValue;
    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          message: "فرمت ایمیل نامعتبر است",
          hint: "فرمت صحیح: example@domain.com",
        });
      }
      identifierType = "email";
      identifierValue = email;
    } else {
      if (!validator.isMobilePhone(phone, "fa-IR")) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          message: "فرمت شماره موبایل نامعتبر است",
          hint: "فرمت صحیح: 09123456789",
        });
      }
      identifierType = "phone";
      identifierValue = phone;
    }

    // Find user with password
    const user = await User.findOne({
      [identifierType]: identifierValue,
    }).select("+password +loginAttempts +isLocked +lockUntil");

    // Account lock check
    if (user?.isLocked) {
      const remainingTime = Math.ceil(
        (user.lockUntil - Date.now()) / (60 * 1000)
      );

      return res.status(StatusCodes.FORBIDDEN).json({
        status: "failure",
        message: "حساب کاربری شما موقتاً قفل شده است",
        details: {
          remainingLockTime: `${remainingTime} دقیقه`,
          unlockTime: new Date(user.lockUntil).toLocaleTimeString("fa-IR"),
        },
        hint: "برای بازیابی دسترسی با پشتیبانی تماس بگیرید",
      });
    }

    // Verify credentials
    if (!user || !(await user.matchPassword(password))) {
      // Increment failed attempts
      if (user) {
        user.loginAttempts += 1;
        if (user.loginAttempts >= 5) {
          user.isLocked = true;
          user.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes lock
        }
        await user.save();
      }

      const remainingAttempts = user ? 5 - user.loginAttempts : 5;

      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "failure",
        message: "اعتبارسنجی ناموفق بود",
        details: {
          remainingAttempts: Math.max(remainingAttempts, 0),
        },
        hint:
          user?.loginAttempts >= 3
            ? `شما ${user.loginAttempts} بار رمز را اشتباه وارد کرده‌اید. ${
                remainingAttempts > 0
                  ? `${remainingAttempts} تلاش باقی مانده`
                  : "حساب شما قفل خواهد شد"
              }`
            : "ایمیل/موبایل یا رمز عبور اشتباه است",
      });
    }

    // Reset login attempts on success
    if (user.loginAttempts > 0 || user.isLocked) {
      user.loginAttempts = 0;
      user.isLocked = false;
      user.lockUntil = undefined;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        authMethod: identifierType,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    // Remove sensitive data before sending user info
    const {
      password: _,
      loginAttempts,
      isLocked,
      lockUntil,
      ...userData
    } = user.toObject();

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "ورود با موفقیت انجام شد",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      message: "خطای سرور در پردازش درخواست",
      hint: "لطفاً بعداً مجدداً تلاش کنید",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
        stack: error.stack,
      }),
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # send Otp To phone -> POST -> users
exports.sendOtpToPhone = async (req, res) => {
  try {
    let { phone } = req.body;
    let user = await User.findOne({ phone });

    if (user) {
      await sendOTPCodeToPhoneHandler(phone, user, req, res);
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "کاربر با چنین شماره همراهی یافت نشد",
      });
    }
  } catch (error) {
    console.error(error.message);
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

// # description -> HTTP VERB -> Accesss
// # verify Otp -> POST -> users
exports.verifyOtp = async (req, res) => {
  try {
    let { phone, code } = req.body;

    let userOtp = await OTP.findOne({ phone });
    let user = await User.findOne({ phone });

    if (userOtp.otpExpiresAt < new Date()) {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "کد OTP منقضی شده است",
      });
    }

    if (userOtp.code === code) {
      createSendToken(
        user,
        StatusCodes.OK,
        "success",
        "کد تایید با موفقیت ارسال شد",
        req,
        res
      );
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "کد وارد شده اشتباه است!",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
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
    const { userId, token, password, confirmPassword } = req.body;

    // Validate input
    if (!userId || !token || !password || !confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "تمام فیلدهای الزامی را پر کنید",
      });
    }

    if (password !== confirmPassword) {
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
