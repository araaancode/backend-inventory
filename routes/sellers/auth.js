const express = require("express")

const router = express()

const userAuthCtrls = require("../../controllers/customers/auth")

router.post('/login', userAuthCtrls.login)
router.post('/register', userAuthCtrls.register)
router.post('/forgot-password', userAuthCtrls.forgotPassword)
router.post('/reset-password', userAuthCtrls.resetPassword)
router.get('/logout', userAuthCtrls.logout)

router.post('/send-otp-phone', userAuthCtrls.sendOtpToPhone);
// router.post('/send-otp-email', userAuthCtrls.sendOtpToEmail);
router.post('/verify-otp', userAuthCtrls.verifyPhoneOTP);
router.post('/resend-otp', userAuthCtrls.resendPhoneOTP);


module.exports = router 