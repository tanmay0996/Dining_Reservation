const express = require("express");
const routes = express.Router();
const {
  getBooking,
  Payment,
  BookTable,
} = require("../controllers/bookingController");

routes.post("/payment", Payment);
routes.get("/user/:id/booked/:id1", getBooking);
routes.post("/hotel/:id/book", BookTable);

module.exports = routes;
