const express = require("express");
const cors = require("cors");
const router = express.Router();
const {
  managerSignup,
  managerLogin,
  managerForgotPassword,
  Update_Manager_Info,
  get_ManagerInfo_and_HotelInfo,
  addHotel
} = require("../controllers/managerController");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

router.post("/manager/:id/addhotel", cors(corsOptions), addHotel);
router.post("/managersignup", managerSignup);
router.post("/managerlogin", managerLogin);
router.post("/managerforgotpassword", managerForgotPassword);
router.post("/managerprofile/:id", Update_Manager_Info);
router.put("/managerprofile/:id", get_ManagerInfo_and_HotelInfo);

module.exports = router;
