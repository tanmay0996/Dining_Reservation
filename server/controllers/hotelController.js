const Hotels = require("../models/Hotels");
const Bookings = require("../models/Bookings");
const Users = require("../models/Users");
const select_tables_slots = require("../utils/select_tables_slots");
const formthestring = require("../utils/formthestring");

const searchHotels = async (req, res) => {
  try {
    let { hotelsearch } = req.body;

    let hotels;
    if (hotelsearch) {
      hotels = await Hotels.find({
        $or: [
          { name: { $regex: hotelsearch, $options: "i" } }, // Case insensitive search
          { address: { $regex: hotelsearch, $options: "i" } },
        ],
      });
    } else {
      hotels = await Hotels.find();
    }

    if (hotels.length) {
      res.status(200).json({ info: "hi", hotels });
    } else {
      res.status(400).json({ Error: "No hotel found" });
    }
  } catch (e) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

const getHotelById = async (req, res) => {
  try {
    let id = req.params.id;
    let hotel = await Hotels.findOne({ _id: id });

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const result = select_tables_slots(hotel);

    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

// app.post("/hotel/:id/book", async (req, res) => {
//   try {
//     // const { token } = req.cookies;
//     // jwt.verify(token, secretKey, {}, async (err2, info2) => {
//     //   if (err2) {
//     //     throw err2;
//     //   }

//     // console.log("token verified at the booking of table");

//     const { hotel, tableSelected, slotSelected, curruseremail } = req.body;

//     let myhotel = await Hotels.findOne({ _id: req.params.id });
//     let result = select_tables_slots(myhotel);

//     result.slots[tableSelected - 1] = result.slots[tableSelected - 1].filter(
//       (val) => {
//         return val !== slotSelected;
//       }
//     );

//     if (result.slots[tableSelected - 1].length === 0)
//       result.slots[tableSelected - 1] = "";

//     let newslot = formthestring(result.slots);

//     await Hotels.findOneAndUpdate(
//       { _id: req.params.id },
//       {
//         $set: {
//           Available_Slots: newslot,
//         },
//       }
//     );

//     let userid;
//     let user = await Users.findOne({ email: curruseremail });
//     if (user) {
//       userid = user._id;
//     }

//     const currentDate = new Date().toLocaleDateString();

//     let booking = {
//       userId: userid,
//       email: user.email,
//       username: user.username,
//       hotelId: myhotel._id,
//       hotelname: myhotel.name,
//       hoteladdress: myhotel.address,
//       date: `${currentDate}`,
//       table: tableSelected,
//       slot: slotSelected,
//     };

//     booking = new Bookings(booking);

//     let result2 = await booking.save();

//     res.status(200).json({ id: result2._id });
//     // });
//   } catch (e) {
//     console.log(e);
//     res.json({ error: "Something Went Wrong" });
//   }
// });

module.exports = { searchHotels, getHotelById };
