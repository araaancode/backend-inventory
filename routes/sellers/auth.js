const express = require("express");

const router = express();

const sellerAuthCtrls = require("../../controllers/sellers/auth");
const upload = require("../../utils/multerConfig");
const registerValidations = require("../../middlewares/registerValidator");
const errorValidator = require("../../middlewares/errorValidator");

router.post(
  "/register",
  upload.single("avatar"),
  registerValidations,
  errorValidator,
  sellerAuthCtrls.register
);

// router.post("/login", sellerAuthCtrls.login);

// router.post("/forgot-password", sellerAuthCtrls.forgotPassword);
// router.post("/reset-password", sellerAuthCtrls.resetPassword);
// router.get("/logout", sellerAuthCtrls.logout);

// router.post("/send-otp-phone", sellerAuthCtrls.sendOtpToPhone);
// // router.post('/send-otp-email', sellerAuthCtrls.sendOtpToEmail);
// router.post("/verify-otp", sellerAuthCtrls.verifyPhoneOTP);
// router.post("/resend-otp", sellerAuthCtrls.resendPhoneOTP);

module.exports = router;
