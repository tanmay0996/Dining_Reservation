const jwt = require("jsonwebtoken");

const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);
const secretKey = process.env.secretKey;

const Users = require("../models/Users");
const Hotels = require("../models/Hotels");
const Bookings = require("../models/Bookings");

const select_tables_slots = require("../utils/select_tables_slots");
const formthestring = require("../utils/formthestring");

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
      // console.log("Token verified at /booked/:id");

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

const Payment = async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) {
        throw err;
      }

      const {
        hotelname,
        hotel,
        tableSelected,
        slotSelected,
        curruseremail,
        price,
      } = req.body;

      const id = hotel._id;
      const hotelImageUrl = `${process.env.REACT_APP_Host_Api}/uploads/${hotel.image1}`;
      
      const lineItems = [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: hotelname,
              description: `Dining reservation at ${hotelname} for Table ${tableSelected}, Slot ${slotSelected}`,
              images: [hotelImageUrl],
              metadata: {
                table: tableSelected,
                slot: slotSelected,
              },
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ];

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        locale: "en",

        success_url: `${
          process.env.REACT_APP_Stripe_Server
        }/success?id=${id}&tableSelected=${tableSelected}&slotSelected=${slotSelected}&curruseremail=${curruseremail}&token=${encodeURIComponent(
          token
        )}`,

        cancel_url: `${process.env.REACT_APP_Front_End}/cancel/${id}/${tableSelected}/${slotSelected}`,
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });

      res.status(200).json({ id: session.id });
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
};

const BookTable = async (req, res) => {
  try {
    // const { token } = req.cookies;
    // jwt.verify(token, secretKey, {}, async (err2, info2) => {
    //   if (err2) {
    //     throw err2;
    //   }

    // console.log("token verified at the booking of table");

    const { hotel, tableSelected, slotSelected, curruseremail } = req.body;

    let myhotel = await Hotels.findOne({ _id: req.params.id });
    let result = select_tables_slots(myhotel);

    result.slots[tableSelected - 1] = result.slots[tableSelected - 1].filter(
      (val) => {
        return val !== slotSelected;
      }
    );

    if (result.slots[tableSelected - 1].length === 0)
      result.slots[tableSelected - 1] = "";

    let newslot = formthestring(result.slots);

    await Hotels.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          Available_Slots: newslot,
        },
      }
    );

    let userid;
    let user = await Users.findOne({ email: curruseremail });
    if (user) {
      userid = user._id;
    }

    const currentDate = new Date().toLocaleDateString();

    let booking = {
      userId: userid,
      email: user.email,
      username: user.username,
      hotelId: myhotel._id,
      hotelname: myhotel.name,
      hoteladdress: myhotel.address,
      date: `${currentDate}`,
      table: tableSelected,
      slot: slotSelected,
    };

    booking = new Bookings(booking);

    let result2 = await booking.save();

    res.status(200).json({ id: result2._id });
    // });
  } catch (e) {
    console.log(e);
    res.json({ error: "Something Went Wrong" });
  }
};

module.exports = { getBooking, Payment, BookTable };
