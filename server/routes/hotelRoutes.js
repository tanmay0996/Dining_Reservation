const express = require("express");
const router = express.Router();
const {
  searchHotels,
  getHotelById,
} = require("../controllers/hotelController");

router.post("/", searchHotels);
router.get("/hotel/:id", getHotelById);
// router.post("/user/:id", Update_User_Info);

module.exports = router;
