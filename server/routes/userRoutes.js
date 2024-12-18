const express = require("express");
const router = express.Router();
const {
  userSignup,
  userlogin,
  Update_User_Info,
  getUserInfo,
  userForgotPassword,
  user_Delete,
} = require("../controllers/userController");

router.post("/signup", userSignup);
router.post("/login", userlogin);
router.post("/forgotpassword", userForgotPassword);
router.delete("/delete", user_Delete);
router.post("/:id", Update_User_Info);
router.put("/:id", getUserInfo);

module.exports = router;
