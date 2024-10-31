const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const updatetablesMiddleware = require("./middleware/updatetablesMiddleware.js");

const secretKey = process.env.secretKey;
const managersecretKey = process.env.managersecretKey;
const mongodb_url = process.env.mongodb_url;

const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
// app.use(
//   cors({
//     origin: `${process.env.REACT_APP_Front_End}`,
//     credentials: true,
//   })
// );

const allowedOrigins = [
  "http://localhost:3000", // Development URL
  `${process.env.REACT_APP_Front_End}`, // Production URL
  `${process.env.REACT_APP_Host_Api}`, // Backend Production URL
  `${process.env.REACT_APP_Stripe_Server}`, // Stripe Service URL
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, "../build")));

// app.use(
//   "/uploads",
//   express.static("E:/React/Hotel Dining Reservation System/server/uploads")
// );

app.use(updatetablesMiddleware);
app.use(express.urlencoded({ extended: true }));

// mongoose
//   .connect("mongodb://127.0.0.1:27017/hotel_table_booking")
//   .then(() => {
//     console.log("connected to monogo");
//   })
//   .catch(() => {
//     console.log("Database connection Error");
//   });

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

mongoose
  .connect(mongodb_url, clientOptions)
  .then(() => {
    console.log("Connected to Mongo");
  })
  .catch((e) => {
    console.log("Database connection Error ", e);
  });

const hotelRoutes = require("./routes/hotelRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const bookingRoutes = require("./routes/bookingRoutes.js");
const managerRoutes = require("./routes/managerRoutes.js");

app.use("/", hotelRoutes);
app.use("/hotel", hotelRoutes);
app.use("/", userRoutes);
app.use("/", managerRoutes);
app.use("/", bookingRoutes);

app.post("/profile", (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, secretKey, {}, (err, info) => {
      if (err) {
        jwt.verify(token, managersecretKey, {}, (err2, info2) => {
          if (err2) {
            throw err2;
          }
          console.log("Info2 is ", info2);
          res.json(info2);
        });
      } else {
        console.log("from here, Info is ", info);
        res.json(info);
      }
    });
  } catch (e) {
    res.json({ error: "Something Went Wrong" });
  }
});

app.post("/profileofmanager", (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, managersecretKey, {}, (err, info) => {
      if (err) throw err;
      console.log("Info is ", info);
      res.json(info);
    });
  } catch (e) {
    res.json({ error: "Something Went Wrong" });
  }
});

app.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", " ", {
        sameSite: "None",
        secure: true,
        expire: new Date(0),
      })
      .json("ok");
  } catch (e) {
    res.json({ error: "Something Went Wrong" });
  }
});

app.use((req, res, next) => {
  res.status(404).json({ error_not_found: "page not found" });
});

app.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});

// app.post("/", async (req, res) => {
//   try {
//     console.log("getting req");

//     let { hotelsearch } = req.body;

//     let hotels;
//     if (hotelsearch) {
//       hotels = await Hotels.find({
//         $or: [
//           { name: { $regex: hotelsearch } },
//           { address: { $regex: hotelsearch } },
//         ],
//       });
//     } else {
//       hotels = await Hotels.find();
//     }

//     if (hotels.length) {
//       res.status(200).json({ info: "hi", hotels });
//     } else {
//       res.status(400).json({ Error: "No hotel found" });
//     }
//   } catch (e) {
//     res.json({ error: "Something Went Wrong" });
//   }
// });

// function select_tables_slots(hotel) {
//   let tableavailable = [],
//     slots = "";

//   if (hotel && hotel.Available_Slots) {
//     slots = hotel.Available_Slots;
//     slots = slots.split(",").map((slt) => slt.trim());

//     let c = 0;
//     for (let slot of slots) {
//       if (slot) {
//         tableavailable.push(c + 1);
//         let newslot = slot.split(";").map((slt) => slt.trim());

//         slots[c] = newslot;
//       }
//       c++;
//     }
//   }

//   let result = {
//     hotel: hotel,
//     slots: slots,
//     tableavailable: tableavailable,
//   };
//   return result;
// }

// app.get("/hotel/:id", async (req, res) => {
//   try {
//     let id = req.params.id;
//     let hotel = await Hotels.findOne({ _id: id });

//     result = select_tables_slots(hotel);

//     res.status(200).json(result);
//   } catch (e) {
//     console.log(e);
//     res.json({ error: "Something Went Wrong" });
//   }
// });

// function formthestring(slots) {
//   let newslot = "";
//   for (let i of slots) {
//     for (let j of i) {
//       newslot += j;
//       newslot += ";";
//     }
//     if (i !== "") {
//       newslot = newslot.slice(0, -1);
//     }
//     newslot += ",";
//   }

//   return newslot;
// }

// app.post("/payment", async (req, res) => {
//   try {
//     const { token } = req.cookies;
//     jwt.verify(token, secretKey, {}, async (err, info) => {
//       if (err) {
//         throw err;
//       }

//       const {
//         hotelname,
//         hotel,
//         tableSelected,
//         slotSelected,
//         curruseremail,
//         price,
//       } = req.body;

//       const id = hotel._id;
//       // const hotelImageUrl = `http://localhost:3000/images/${hotel.image1}`;
//       // console.log(hotel.image1);
//       const lineItems = [
//         {
//           price_data: {
//             currency: "inr",
//             product_data: {
//               name: hotelname,
//               description: `Dining reservation at ${hotelname} for Table ${tableSelected}, Slot ${slotSelected}`,
//               // images:[hotelImageUrl],
//               metadata: {
//                 table: tableSelected,
//                 slot: slotSelected,
//               },
//             },
//             unit_amount: price * 100,
//           },
//           quantity: 1,
//         },
//       ];

//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items: lineItems,
//         mode: "payment",
//         locale: "en",
//         success_url: `http://localhost:5001/success?id=${id}&tableSelected=${tableSelected}&slotSelected=${slotSelected}&curruseremail=${encodeURIComponent(
//           curruseremail
//         )}&token=${encodeURIComponent(token)}`,
//         cancel_url: `http://localhost:3000/cancel/${id}/${tableSelected}/${slotSelected}`,
//       });

//       res.status(200).json({ id: session.id });
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).send("Internal Server Error");
//   }
// });

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

// const bookingRoutes = require("./routes/bookingRoutes.js");
// app.use("/", bookingRoutes);

// app.get("/user/:id/booked/:id1", async (req, res) => {
//   try {
//     const { token } = req.cookies;
//     jwt.verify(token, secretKey, {}, async (err2, info2) => {
//       if (err2) {
//         if (
//           err2.name === "JsonWebTokenError" &&
//           (err2.message === "jwt malformed" ||
//             err2.message === "invalid signature")
//         ) {
//           return res.redirect("http://localhost:3000");
//         } else throw err2;
//       }
//       console.log("Token verified at /booked/:id");

//       let bookingid = req.params.id1;
//       let result = await Bookings.findOne({ _id: bookingid });

//       if (info2.userId === result.userId) {
//         res.status(200).json(result);
//       } else {
//         console.log("info2.userId !== result.userId");
//         res.status(401).json({ error: "Something went wrong" });
//       }
//     });
//   } catch (e) {
//     console.log(e);
//     res.json({ error: "Something Went Wrong" });
//   }
// });

// app.post("/usersignup", async (req, res) => {
//   try {
//     const { username, email, pwd, phn } = req.body;
//     if (!username || !email || !phn || !pwd) {
//       return res.status(400).json({ error: "Fill Up the form" });
//     }

//     const salt = await bcrypt.genSalt(12);
//     const hash = await bcrypt.hash(req.body.pwd, salt);
//     req.body.pwd = hash;

//     let doexists = await Users.findOne({ email });
//     if (doexists) {
//       return res.status(400).json({ error: "User Exists" });
//     }

//     let user = await Users.create(req.body);
//     const token = jwt.sign(
//       { userId: user._id, username: user.username, email: user.email },
//       secretKey
//     );

//     return res
//       .status(200)
//       .cookie("token", token, {
//         httpOnly: true,
//         sameSite: "None",
//         secure: true,
//       })
//       .json({ userId: user._id, username: user.username, email: user.email });
//   } catch (e) {
//     res.json({ error: "Something Went Wrong" });
//   }
// });

// app.post("/userlogin", async (req, res) => {
//   try {
//     const { email, pwd } = req.body;
//     if (!email || !pwd) {
//       return res.status(400).json({ error: "Fill Up the form" });
//     }

//     const user = await Users.findOne({ email });

//     if (user) {
//       const result = await bcrypt.compare(pwd, user.pwd);

//       if (result) {
//         const token = jwt.sign(
//           { userId: user._id, username: user.username, email: user.email },
//           secretKey
//         );

//         res
//           .cookie("token", token, {
//             httpOnly: true,
//             sameSite: "None",
//             secure: true,
//           })
//           .json({
//             userId: user._id,
//             username: user.username,
//             email: user.email,
//           });
//       } else {
//         return res.status(401).json({ error: "Incorrect password" });
//       }
//     } else {
//       return res.status(404).json({ error: "User not found" });
//     }
//   } catch (e) {
//     console.log(e);
//     res.json({ error: "Something Went Wrong" });
//   }
// });

// app.put("/user/:id", async (req, res) => {
//   try {
//     const { token } = req.cookies;
//     jwt.verify(token, secretKey, {}, async (err2, info2) => {
//       if (err2) {
//         throw err2;
//       }

//       console.log("token verified at /user");

//       let email = req.body.curruseremail;
//       let user = await Users.findOne({ email });

//       let bookings = await Bookings.find({ email });
//       bookings = bookings.reverse();

//       res.json({ user, bookings });
//     });
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post("/user/:id", async (req, res) => {
//   try {
//     let { token } = req.cookies;

//     jwt.verify(token, secretKey, {}, async (err2, info2) => {
//       if (err2) {
//         throw err2;
//       }

//       let email = req.body.curruseremail;
//       let user = await Users.findOne({ email });

//       if (req.body.newpwd) {
//         const salt = await bcrypt.genSalt(12);
//         const hash = await bcrypt.hash(req.body.newpwd, salt);
//         req.body.newpwd = hash;

//         let result = await Users.findOneAndUpdate(
//           { email: email },
//           {
//             $set: {
//               username: req.body.newname,
//               pwd: req.body.newpwd,

//               phn: req.body.newphn,
//             },
//           }
//         );
//       } else {
//         let result = await Users.findOneAndUpdate(
//           { email: email },
//           {
//             $set: {
//               username: req.body.newname,
//               phn: req.body.newphn,
//             },
//           }
//         );
//       }

//       const newtoken = jwt.sign(
//         { userId: user._id, username: req.body.newname, email: user.email },
//         secretKey
//       );

//       res
//         .cookie("token", newtoken, {
//           httpOnly: true,
//           sameSite: "None",
//           secure: true,
//         })
//         .json({ name: req.body.newname });
//     });
//   } catch (e) {
//     console.error("Error fetching user:", e);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post("/userforgotpassword", async (req, res) => {
//   try {
//     const { email, pwd } = req.body;

//     if (!email || !pwd) {
//       return res.status(400).json({ error: "Fill Up the form" });
//     } else {
//       let user = await Users.findOne({ email });

//       if (user) {
//         const salt = await bcrypt.genSalt(12);
//         const hash = await bcrypt.hash(req.body.pwd, salt);
//         req.body.newpwd = hash;

//         let result = await Users.findOneAndUpdate(
//           { email: email },
//           {
//             $set: {
//               pwd: req.body.newpwd,
//             },
//           }
//         );
//         res.status(200).json({ email: req.body.newemail });
//       } else {
//         res.status(404).json({ error: "User Not Found" });
//       }
//     }
//   } catch (e) {
//     console.error("Error fetching user:", e);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.delete("/userdelete", async (req, res) => {
//   try {
//     const { token } = req.cookies;
//     jwt.verify(token, secretKey, {}, async (err, info) => {
//       if (err) {
//         throw err;
//       }

//       const email = req.body.curruseremail;

//       let result = await Users.deleteOne({ email });

//       res
//         .cookie("token", " ", {
//           sameSite: "None",
//           secure: true,
//           expire: new Date(0),
//         })
//         .json(result);
//     });
//   } catch (e) {
//     console.log("Error:", e);
//     res.json({ Error: e });
//   }
// });

// app.post("/managersignup", async (req, res) => {
//   try {
//     const { name, email, pwd, phn, address, aadhar, pan } = req.body;

//     if (!name || !email || !phn || !pwd || !address || !aadhar || !pan) {
//       return res.status(400).json({ error: "Fill Up the form" });
//     }

//     const salt = await bcrypt.genSalt(12);
//     const hash = await bcrypt.hash(req.body.pwd, salt);
//     req.body.pwd = hash;

//     let doexists = await Managers.findOne({ email });
//     if (doexists) {
//       return res.status(400).json({ error: "Manager Exists" });
//     }

//     let manager = new Managers(req.body);
//     let result = await manager.save();

//     const token = jwt.sign(
//       {
//         managerId: manager._id,
//         managername: manager.name,
//         email: manager.email,
//       },
//       managersecretKey
//     );

//     return res
//       .status(200)
//       .cookie("token", token, {
//         httpOnly: true,
//         sameSite: "None",
//         secure: true,
//       })
//       .json({
//         managerId: manager._id,
//         managername: manager.name,
//         email: manager.email,
//       });
//   } catch (e) {
//     res.json({ error: "Something Went Wrong" });
//   }
// });

// app.post("/managerlogin", async (req, res) => {
//   try {
//     const { email, pwd } = req.body;
//     if (!email || !pwd) {
//       return res.status(400).json({ error: "Fill Up the form" });
//     }

//     const manager = await Managers.findOne({ email });

//     if (manager) {
//       const result = await bcrypt.compare(pwd, manager.pwd);

//       if (result) {
//         const token = jwt.sign(
//           {
//             managerId: manager._id,
//             managername: manager.name,
//             email: manager.email,
//           },
//           managersecretKey
//         );

//         return res
//           .status(200)
//           .cookie("token", token, {
//             httpOnly: true,
//             sameSite: "None",
//             secure: true,
//           })
//           .json({
//             managerId: manager._id,
//             username: manager.name,
//             email: manager.email,
//           });
//       } else {
//         return res.status(401).json({ error: "Incorrect password" });
//       }
//     } else {
//       return res.status(404).json({ error: "Manager not found" });
//     }
//   } catch (e) {
//     res.json({ error: "Something Went Wrong" });
//   }
// });

// app.put("/managerprofile/:id", async (req, res) => {
//   try {
//     const { token } = req.cookies;
//     jwt.verify(token, managersecretKey, {}, async (err, info) => {
//       if (err) {
//         console.log("Got the error");
//         throw err;
//       } else {
//         let email = info.email;
//         let hotelsearch = req.body.hotelsearch;

//         let manager = await Managers.findOne({ email });

//         let hotels;
//         if (hotelsearch) {
//           hotels = await Hotels.find({
//             $and: [
//               { managerId: manager._id },
//               {
//                 $or: [
//                   { name: { $regex: hotelsearch } },
//                   { address: { $regex: hotelsearch } },
//                 ],
//               },
//             ],
//           });
//         } else {
//           hotels = await Hotels.find({ managerId: manager._id });
//         }

//         res.json({ manager, hotels });
//       }
//     });
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post("/managerprofile/:id", async (req, res) => {
//   try {
//     const { token } = req.cookies;
//     jwt.verify(token, managersecretKey, {}, async (err, info) => {
//       if (err) throw err;

//       let email = req.body.curruseremail;
//       let manager = await Manager.findOne({ email });

//       if (req.body.newpwd) {
//         const salt = await bcrypt.genSalt(12);
//         const hash = await bcrypt.hash(req.body.newpwd, salt);
//         req.body.newpwd = hash;

//         let result = await Managers.findOneAndUpdate(
//           { email: email },
//           {
//             $set: {
//               name: req.body.newname,

//               phn: req.body.newphn,
//               pwd: req.body.newpwd,
//               address: req.body.newaddress,
//               aadhar: req.body.newaadhar,
//               pan: req.body.newpan,
//             },
//           }
//         );
//       } else {
//         let result = await Managers.findOneAndUpdate(
//           { email: email },
//           {
//             $set: {
//               name: req.body.newname,

//               phn: req.body.newphn,
//               address: req.body.newaddress,
//               aadhar: req.body.newaadhar,
//               pan: req.body.newpan,
//             },
//           }
//         );
//       }

//       const newtoken = jwt.sign(
//         {
//           managerId: manager._id,
//           managername: req.body.newname,
//           email: manager.email,
//         },
//         managersecretKey
//       );

//       res
//         .cookie("token", newtoken, {
//           httpOnly: true,
//           sameSite: "None",
//           secure: true,
//         })
//         .json({ name: req.body.newname });
//     });
//   } catch (e) {
//     console.error("Error fetching user:", e);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post("/managerforgotpassword", async (req, res) => {
//   try {
//     let { email, pwd } = req.body;
//     if (!email || !pwd) {
//       res.status(400).json({ error: "Fill up the Form" });
//     } else {
//       let manager = await Managers.findOne({ email });

//       if (manager) {
//         const salt = await bcrypt.genSalt(12);
//         const hash = await bcrypt.hash(req.body.pwd, salt);
//         req.body.newpwd = hash;

//         let result = await Managers.findOneAndUpdate(
//           { email: email },
//           {
//             $set: {
//               pwd: req.body.newpwd,
//             },
//           }
//         );
//         res.status(200).json({ email: req.body.newemail });
//       } else {
//         res.status(400).json({ error: "Manager not Found" });
//       }
//     }
//   } catch (e) {
//     console.error("Error fetching user:", e);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// function makestring(starttime, endtime, no_of_tables) {
//   let Available_Slots = "";

//   for (let k = 1; k <= no_of_tables; k++) {
//     let i = parseInt(starttime) + 1,
//       j = parseInt(endtime);
//     let str = "";
//     while (i <= j) {
//       str += (i - 1).toString() + "-" + i.toString() + ";";
//       i++;
//     }
//     str = str.slice(0, -1);
//     str += ",";
//     Available_Slots += str;
//   }

//   Available_Slots = Available_Slots.slice(0, -1);
//   return Available_Slots;
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "../client/public/images");
//   },
//   filename: async function (req, file, cb) {
//     const hotelId = req.body.hotelId;
//     const filename = `${hotelId}_${file.fieldname}.jpg`;
//     cb(null, filename);
//   },
// });

// const upload = multer({ storage: storage }).fields([
//   { name: "img1", maxCount: 1 },
//   { name: "img2", maxCount: 1 },
// ]);

// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true,
// };

// app.post("/manager/:id/addhotel", cors(corsOptions), async (req, res) => {
//   try {
//     const { token } = req.cookies;
//     jwt.verify(token, managersecretKey, {}, (err, info) => {
//       if (err) {
//         console.log("token verification error");
//         throw err;
//       }

//       console.log("token verified at manager.addhotel");
//       upload(req, res, async (err) => {
//         if (err instanceof multer.MulterError) {
//           if (err.code === "LIMIT_FILE_SIZE") {
//             return res.status(400).json({ error: "File size too large" });
//           }
//         } else if (err) {
//           console.error("File upload error:", err);
//           return res.status(500).json({ error: "File upload failed" });
//         }

//         console.log("Uploaded files:", req.files);
//         try {
//           const {
//             name,
//             address,
//             timeday,
//             starttime,
//             endtime,
//             cuisines,
//             avg_cost1,
//             Mustorder,
//             ModeOfPayment,
//             Phone1,
//             Email,
//             fulladdress,
//             no_of_tables1,
//             Features,
//             curruseremail,
//           } = req.body;

//           if (
//             !name ||
//             !address ||
//             !timeday ||
//             !starttime ||
//             !endtime ||
//             !cuisines ||
//             !avg_cost1 ||
//             !Mustorder ||
//             !ModeOfPayment ||
//             !Phone1 ||
//             !Email ||
//             !fulladdress ||
//             !no_of_tables1 ||
//             !Features ||
//             !curruseremail
//           ) {
//             return res.status(400).json({ error: "Fill Up the form" });
//           } else {
//             let Available_Slots = makestring(starttime, endtime, no_of_tables1);

//             let time = starttime.toString() + " - " + endtime.toString();
//             let manager = await Managers.findOne({ email: curruseremail });
//             let managerId = manager._id;

//             const today = new Date().toLocaleDateString();
//             const currentDate = today.split(",")[0];

//             let result = new Hotels({
//               managerId,
//               name,
//               address,
//               timeday,
//               time,
//               cuisines,
//               avg_cost: avg_cost1,
//               Mustorder,
//               ModeOfPayment,
//               Phone: Phone1,
//               Email,
//               fulladdress,
//               no_of_tables: no_of_tables1,

//               Features,
//               Available_Slots,
//               lastupdated: currentDate,
//             });

//             console.log("Final added before hotel, ", result);
//             result = await result.save();

//             const hotelId = result._id;

//             const updateImageFilenames = async (fieldName) => {
//               const filename = req.files[fieldName][0].filename;
//               const newFilename = `${hotelId}_${fieldName}.jpg`;

//               console.log("Old name ", filename);
//               console.log("New name ", newFilename);

//               fs.rename(
//                 path.join("../client/public/images", filename),
//                 path.join("../client/public/images", newFilename),
//                 (err) => {
//                   if (err) throw err;
//                   console.log(`${filename} renamed to ${newFilename}`);
//                 }
//               );

//               return newFilename;
//             };

//             const image1Filename = await updateImageFilenames("img1");
//             const image2Filename = await updateImageFilenames("img2");

//             await Hotels.findByIdAndUpdate(hotelId, {
//               image1: image1Filename,
//               image2: image2Filename,
//             });

//             console.log("Final added hotel, ", result);
//             res.status(200).json(result);
//           }
//         } catch (e) {
//           res.status(400).json({ error: e });
//         }
//       });
//     });
//   } catch (e) {
//     res.json({ error: "Something Went Wrong" });
//   }
// });

// async function updatetables() {
//   const today = new Date().toLocaleDateString();
//   const currentDate = today.split(",")[0];

//   let hotels = await Hotels.find();
//   for (let hotel of hotels) {
//     if (hotel.lastupdated !== currentDate) {
//       let time = hotel.time;
//       time = time.split(" - ");
//       let starttime = time[0],
//         endtime = time[1];
//       let Available_Slots = makestring(starttime, endtime, hotel.no_of_tables);

//       await Hotels.updateOne(
//         { _id: hotel._id },
//         { lastupdated: currentDate, Available_Slots }
//       );
//     }
//   }
// }

// async function updatetablesMiddleware(req, res, next) {
//   try {
//     await updatetables();
//     next();
//   } catch (error) {
//     console.error("Error updating tables:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
