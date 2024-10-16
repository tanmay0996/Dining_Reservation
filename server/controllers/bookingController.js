const express = require("express");
const Bookings = require("../models/Bookings");

const getBooking = async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, secretKey, {}, async (err2, info2) => {
      if (err2) {
        if (
          err2.name === "JsonWebTokenError" &&
          (err2.message === "jwt malformed" ||
            err2.message === "invalid signature")
        ) {
          return res.redirect("http://localhost:3000");
        } else throw err2;
      }
      console.log("Token verified at /booked/:id");

      let bookingid = req.params.id1;
      let result = await Bookings.findOne({ _id: bookingid });

      if (info2.userId === result.userId) {
        res.status(200).json(result);
      } else {
        console.log("info2.userId !== result.userId");
        res.status(401).json({ error: "Something went wrong" });
      }
    });
  } catch (e) {
    console.log(e);
    res.json({ error: "Something Went Wrong" });
  }
};

module.exports = { getBooking };
