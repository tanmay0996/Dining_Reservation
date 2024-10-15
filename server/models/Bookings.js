const mongoose = require("mongoose");
const bookingschema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  hotelId: {
    type: String,
    required: true,
  },
  hotelname: {
    type: String,
    required: true,
  },
  hoteladdress: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  table: {
    type: String,
    required: true,
  },
  slot: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("bookings", bookingschema);
