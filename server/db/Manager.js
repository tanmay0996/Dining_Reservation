const mongoose = require("mongoose");
const managerschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phn: {
    type: Number,
    required: true,
  },
  pwd: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  aadhar: {
    type: String,
    required: true,
  },
  pan: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("managers", managerschema);
