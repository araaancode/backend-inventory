// models/User.js

const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      default: "default.jpg",
    },

    storeName: {
      type: String,
      required: [true, "Store Name required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    username: {
      type: String,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username must be at most 20 characters"],
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    deviceId: {
      type: String,
      unique: true,
      sparse: true,
    },

    isGuest: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^09\d{9}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid Iranian mobile number`,
      },
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["admin", "seller", "customer"],
      default: "customer",
      required: [true, "User role is required"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // نام و نام خانوادگی
    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // آدرس
    address: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    // کد پستی
    postalCode: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid Iranian postal code`,
      },
    },

    // کد ملی
    nationalCode: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid national code`,
      },
    },

    // کد اقتصادی
    economicode: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    // لوگوی فروشگاه
    storeLogo: {
      type: String,
      default: "",
    },

    // عکس امضا
    signatureImage: {
      type: String,
      default: "",
    },

    // عکس مهر
    stampImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Middleware and methods
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
