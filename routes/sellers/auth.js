const express = require("express");

const router = express();

const sellerAuthCtrls = require("../../controllers/sellers/auth");
const upload = require("../../utils/multerConfig");
const authValidator = require("../../validators/authValidator");
const errorValidator = require("../../validators/errorValidator");

// register seller
router.post(
  "/register",
  upload.single("avatar"),
  authValidator.registerValidations,
  errorValidator,
  sellerAuthCtrls.register
);

// login seller
router.post(
  "/login",
  authValidator.loginValidations,
  errorValidator,
  sellerAuthCtrls.login
);

// router.post("/forgot-password", sellerAuthCtrls.forgotPassword);
// router.post("/reset-password", sellerAuthCtrls.resetPassword);
// router.get("/logout", sellerAuthCtrls.logout);

// router.post("/send-otp-phone", sellerAuthCtrls.sendOtpToPhone);
// // router.post('/send-otp-email', sellerAuthCtrls.sendOtpToEmail);
// router.post("/verify-otp", sellerAuthCtrls.verifyPhoneOTP);
// router.post("/resend-otp", sellerAuthCtrls.resendPhoneOTP);

module.exports = router;
