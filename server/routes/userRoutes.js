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

router.post("/usersignup", userSignup);
router.post("/userlogin", userlogin);
router.post("/user/:id", Update_User_Info);
router.put("/user/:id", getUserInfo);
router.post("/userforgotpassword", userForgotPassword);
router.delete("/userdelete", user_Delete);

module.exports = router;
