const express = require("express");
const router = express.Router();
const {
  managerSignup,
  managerLogin,
  managerForgotPassword,
  Update_Manager_Info,
  get_ManagerInfo_and_HotelInfo,
} = require("../controllers/managerController");

router.post("/managersignup", managerSignup);
router.post("/managerlogin", managerLogin);
router.post("/managerforgotpassword", managerForgotPassword);
router.post("/managerprofile/:id", Update_Manager_Info);
router.put("/managerprofile/:id", get_ManagerInfo_and_HotelInfo);

module.exports = router;
