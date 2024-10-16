const express = require("express");
const routes = express.Router();
const { getBooking } = require("../controllers/bookingController");

routes.get("/user/:id/booked/:id1", getBooking);

module.exports = { getBooking };
