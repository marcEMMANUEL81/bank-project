const express = require("express");
const router = express.Router();

const userController = require("../controller/user")
const cardController = require("../controller/card")
const otpController = require("../controller/sendOTP_to_phone")
const verifyController = require("../controller/verifyOTP")

// route for user sign, log , and more
router.post("/createUser", userController.createUser);
router.post("/logIn", userController.logIn);
router.post("/getAllCards", userController.getAllCards);

// route for cards
router.post("/createCard", cardController.createCard);
router.post("/stateCard", cardController.stateCard);
router.post("/accountOperation", cardController.accountOperation);
router.post("/depositOnAccount", cardController.depositOnAccount);
router.post("/withDrawOnAccount", cardController.withDrawOnAccount);

// routes for OTP
router.post("/otp/phone", otpController.sendOtpToPhone);
router.post("/verify/otp", verifyController.verifyotp);

module.exports = router;