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
