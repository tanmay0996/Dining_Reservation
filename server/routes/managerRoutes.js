const express = require("express");
const cors = require("cors");
const router = express.Router();
const {
  managerSignup,
  managerLogin,
  managerForgotPassword,
  Update_Manager_Info,
  get_ManagerInfo_and_HotelInfo,
  addHotel,
} = require("../controllers/managerController");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

router.post("/signup", managerSignup);
router.post("/login", managerLogin);
router.post("/forgotpassword", managerForgotPassword);
router.post("/profile/:id", Update_Manager_Info);
router.put("/profile/:id", get_ManagerInfo_and_HotelInfo);
router.post("/:id/addhotel", cors(corsOptions), addHotel);

module.exports = router;
