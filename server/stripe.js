const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

const secretKey = process.env.secretKey;

const PORT = process.env.PORT || 5001;

app.get("/success", async (req, res) => {
  const { id, tableSelected, slotSelected, curruseremail, token } = req.query;

  try {
    if (!token) {
      return res.status(401).send("Authorization token missing");
    }

    jwt.verify(decodeURIComponent(token), secretKey, async (err, info) => {
      if (err) {
        console.log(err);
        return res.status(403).send("Invalid token");
      }

      const userId = info.userId;
      const hotel = { _id: id };

      const response = await axios.post(
        `${process.env.REACT_APP_Host_Api}/api/booking/hotel/${id}/book`,
        {
          hotel,
          tableSelected,
          slotSelected,
          curruseremail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const bookingId = response.data.id;
      console.log("Booking successful:", response.data);

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        })
        .redirect(
          `${process.env.REACT_APP_Front_End}/user/${userId}/booked/${bookingId}`
        );
    });
  } catch (error) {
    console.error("Error booking hotel:", error);
    res.status(500).send("Booking failed");
  }
});

app.listen(PORT, () => {
  console.log(`Redirect server is running on port ${PORT}`);
});
