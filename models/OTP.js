const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// OTP Schema
const OTPSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^09\d{9}$/.test(v); // Fixed regex (added ^ and $)
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email"],
      unique: true,
      sparse: true,
    },
    code: {
      type: String,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    otpExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000), // 5-minute expiry
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: "10m" }, // Auto-delete after 10m (MongoDB TTL)
    },
  },
  { timestamps: true }
);

// Hash OTP before saving
OTPSchema.pre("save", async function (next) {
  if (!this.isModified("code")) return next();
  const salt = await bcrypt.genSalt(10);
  this.code = await bcrypt.hash(this.code, salt);
  next();
});

// Generate a secure 6-digit OTP
OTPSchema.statics.generateOTP = function () {
  return crypto.randomInt(100000, 999999).toString(); // 6-digit cryptographically secure OTP
};

// Verify OTP (checks expiry, usage, and hash match)
OTPSchema.methods.verifyOTP = async function (enteredCode) {
  if (this.isUsed || this.otpExpiresAt < new Date()) {
    return false;
  }
  const isMatch = await bcrypt.compare(enteredCode, this.code);
  if (isMatch) this.isUsed = true;
  return isMatch;
};

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;