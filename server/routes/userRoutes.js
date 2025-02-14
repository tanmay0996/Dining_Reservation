const express = require("express");
const router = express.Router();
const {
  userSignup,
  userGetOtp_signup,
  userVerifyOtpController,
  userlogin,
  Update_User_Info,
  getUserInfo,
  userForgotPassword,
  userGetOtp_forgotpassword,
  user_Delete,
} = require("../controllers/userController");

router.post("/signup", userSignup);
router.post("/getotp_signup", userGetOtp_signup);
router.post("/verifyotp", userVerifyOtpController);

router.post("/login", userlogin);

router.post("/forgotpassword", userForgotPassword);
router.post("/getotpforgotpassword", userGetOtp_forgotpassword);

router.delete("/delete", user_Delete);

router.post("/:id", Update_User_Info);
router.put("/:id", getUserInfo);

module.exports = router;
