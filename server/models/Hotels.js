const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/e-commerce");

const hotelSchema = new mongoose.Schema({
  managerId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  timeday: {
    type: String,
  },
  time: {
    type: String,
    required: true,
  },
  cuisines: {
    type: String,
    required: true,
  },
  avg_cost: {
    type: Number,
  },
  Mustorder: {
    type: String,
  },
  ModeOfPayment: {
    type: String,
    required: true,
  },
  Phone: {
    type: Number,
  },
  Email: {
    type: String,
  },
  fulladdress: {
    type: String,
    required: true,
  },
  no_of_tables: {
    type: Number,
    required: true,
  },
  // no_of_tables_available: {
  //   type: Number,
  //   required: true,
  // },
  Features: {
    type: String,
    required: true,
  },
  Available_Slots: {
    type: String,
    required: true,
  },
  image1: {
    type: String,
  },
  image2: {
    type: String,
  },
  lastupdated: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("hotels", hotelSchema);
