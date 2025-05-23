const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.urlencoded({ extended: true }));

const managersecretKey = process.env.managersecretKey;

const Managers = require("../models/Manager");
const Hotels = require("../models/Hotels");

const generatePassword = require("../utils/generatePassword");
const makestring = require("../utils/makestring");
const {
  errorForUserSignUp,
  errorForManagerSignUp,
  errorForEmail,
} = require("../utils/validationerrors");
const { sendOtp, verifyOtp } = require("../utils/otphandler");

const managerSignup = async (req, res) => {
  try {
    const { name, email, pwd, phn, address, aadhar, pan } = req.body;

    if (!name || !email || !phn || !pwd || !address || !aadhar || !pan) {
      return res.status(400).json({ error: "Fill Up the form" });
    }

    const validationErrors = errorForManagerSignUp(req.body);

    if (Object.keys(validationErrors).length > 0) {
      let err;
      if (validationErrors.email) err += validationErrors.email;
      if (validationErrors.phn) err += validationErrors.phn + "\n";
      if (validationErrors.aadhar) err += validationErrors.aadhar + "\n";
      if (validationErrors.pan) err += validationErrors.pan + "\n";

      return res.status(400).json({ error: err, donavigate: false });
    }
    req.body.pwd = await generatePassword(req.body.pwd);

    let doexists = await Managers.findOne({ email });
    if (doexists) {
      return res.status(400).json({ error: "Manager Exists" });
    }

    let manager = new Managers(req.body);
    let result = await manager.save();

    const token = jwt.sign(
      {
        managerId: manager._id,
        managername: manager.name,
        email: manager.email,
      },
      managersecretKey
    );

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      })
      .json({
        managerId: manager._id,
        managername: manager.name,
        email: manager.email,
      });
  } catch (e) {
    console.log("Error: ", e);
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};

const managerGetOtp_signup = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Enter your email" });

    let manager = await Managers.findOne({ email });

    if (manager) return res.status(404).json({ error: "Manager Exists" });

    const response = await sendOtp(email, "signup");
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const managerVerifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ error: "Email and OTP required" });

    const otpResult = verifyOtp(email, otp);
    if (!otpResult.success)
      return res.status(400).json({ error: otpResult.error });

    return res.status(200).json({
      message: "OTP verified",
    });
  } catch (e) {
    console.error("Error:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const managerLogin = async (req, res) => {
  try {
    const { email, pwd } = req.body;
    if (!email || !pwd) {
      return res.status(400).json({ error: "Fill Up the form" });
    }

    const validationErrors = errorForEmail(email);

    if (validationErrors?.email) {
      return res
        .status(400)
        .json({ error: validationErrors.email, donavigate: false });
    }

    const manager = await Managers.findOne({ email });

    if (manager) {
      const result = await bcrypt.compare(pwd, manager.pwd);

      if (result) {
        const token = jwt.sign(
          {
            managerId: manager._id,
            managername: manager.name,
            email: manager.email,
          },
          managersecretKey
        );

        return res
          .status(200)
          .cookie("token", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          })
          .json({
            managerId: manager._id,
            username: manager.name,
            email: manager.email,
          });
      } else {
        return res.status(401).json({ error: "Incorrect password" });
      }
    } else {
      return res.status(404).json({ error: "Manager not found" });
    }
  } catch (e) {
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};

const managerForgotPassword = async (req, res) => {
  try {
    let { email, pwd, confirmpwd } = req.body;
    if (!email || !pwd || !confirmpwd) {
      return res.status(400).json({ error: "Fill up the Form" });
    } else {
      const validationErrors = errorForEmail(email);

      if (validationErrors?.email) {
        return res
          .status(400)
          .json({ error: validationErrors.email, donavigate: false });
      }

      if (pwd !== confirmpwd)
        return res.status(400).json({
          error: "Entered Passwords are different",
          donavigate: false,
        });

      let manager = await Managers.findOne({ email });

      if (manager) {
        req.body.newpwd = await generatePassword(req.body.pwd);

        let result = await Managers.findOneAndUpdate(
          { email: email },
          {
            $set: {
              pwd: req.body.newpwd,
            },
          }
        );
        return res.status(200).json({ email: req.body.newemail });
      } else {
        return res.status(400).json({ error: "Manager not Found" });
      }
    }
  } catch (e) {
    console.error("Error fetching user:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const managerGetOtp_forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Enter your email" });

    let manager = await Managers.findOne({ email });

    if (!manager) return res.status(404).json({ error: "Manager Not Found" });

    const response = await sendOtp(email, "forgotpassword");
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const Update_Manager_Info = async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, managersecretKey, {}, async (err, info) => {
      if (err) throw err;

      const { newname, curruseremail, newphn, newaddress, newaadhar, newpan } =
        req.body;

      if (
        !newname ||
        !curruseremail ||
        !newphn ||
        !newaddress ||
        !newaadhar ||
        !newpan
      ) {
        return res
          .status(400)
          .json({ error: "Fill Up the Form", donavigate: false });
      }

      const validationErrors = errorForManagerSignUp({
        email: curruseremail,
        phn: newphn,
        address: newaddress,
        aadhar: newaadhar,
        pan: newpan,
      });

      if (Object.keys(validationErrors).length > 0) {
        let err;
        if (validationErrors.email) err += validationErrors.email;
        if (validationErrors.phn) err += validationErrors.phn + "\n";
        if (validationErrors.aadhar) err += validationErrors.aadhar + "\n";
        if (validationErrors.pan) err += validationErrors.pan + "\n";

        return res.status(400).json({ error: err, donavigate: false });
      }

      let email = req.body.curruseremail;
      let manager = await Managers.findOne({ email });

      if (req.body.newpwd) {
        req.body.newpwd = await generatePassword(req.body.newpwd);

        let result = await Managers.findOneAndUpdate(
          { email: email },
          {
            $set: {
              name: req.body.newname,

              phn: req.body.newphn,
              pwd: req.body.newpwd,
              address: req.body.newaddress,
              aadhar: req.body.newaadhar,
              pan: req.body.newpan,
            },
          }
        );
      } else {
        let result = await Managers.findOneAndUpdate(
          { email: email },
          {
            $set: {
              name: req.body.newname,

              phn: req.body.newphn,
              address: req.body.newaddress,
              aadhar: req.body.newaadhar,
              pan: req.body.newpan,
            },
          }
        );
      }

      const newtoken = jwt.sign(
        {
          managerId: manager._id,
          managername: req.body.newname,
          email: manager.email,
        },
        managersecretKey
      );

      res
        .cookie("token", newtoken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        })
        .status(200)
        .json({ name: req.body.newname });
    });
  } catch (e) {
    console.error("Error fetching user:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const get_ManagerInfo_and_HotelInfo = async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, managersecretKey, {}, async (err, info) => {
      if (err) {
        console.log("err");
        throw err;
      } else {
        let email = info.email;
        let hotelsearch = req.body.hotelsearch;

        let manager = await Managers.findOne({ email });

        let hotels;
        if (hotelsearch) {
          hotels = await Hotels.find({
            $and: [
              { managerId: manager._id },
              {
                $or: [
                  { name: { $regex: hotelsearch, $options: "i" } }, // Case insensitive search
                  { address: { $regex: hotelsearch, $options: "i" } },
                ],
              },
            ],
          });
        } else {
          hotels = await Hotels.find({ managerId: manager._id });
        }

        return res.status(200).json({ manager, hotels });
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const hotelId = req.body.hotelId;
    const filename = `${hotelId}_${file.fieldname}.jpg`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "img1", maxCount: 1 },
  { name: "img2", maxCount: 1 },
]);

const addHotel = async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, managersecretKey, {}, (err, info) => {
      if (err) {
        console.log("token verification error");
        throw err;
      }

      console.log("token verified at manager.addhotel");

      upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File size too large" });
          }
        } else if (err) {
          console.error("File upload error:", err);
          return res.status(500).json({ error: "File upload failed" });
        }

        console.log("Uploaded files:", req.files);

        try {
          const {
            name,
            address,
            timeday,
            starttime,
            endtime,
            cuisines,
            avg_cost1,
            Mustorder,
            ModeOfPayment,
            Phone1,
            Email,
            fulladdress,
            no_of_tables1,
            Features,
            curruseremail,
          } = req.body;

          if (
            !name ||
            !address ||
            !timeday ||
            !starttime ||
            !endtime ||
            !cuisines ||
            !avg_cost1 ||
            !Mustorder ||
            !ModeOfPayment ||
            !Phone1 ||
            !Email ||
            !fulladdress ||
            !no_of_tables1 ||
            !Features ||
            !curruseremail
          ) {
            return res.status(400).json({ error: "Fill Up the form" });
          }

          const validationErrors = errorForUserSignUp({
            email: Email,
            phn: Phone1,
          });

          if (Object.keys(validationErrors).length > 0) {
            let err;
            if (validationErrors.email) err += validationErrors.email;
            if (validationErrors.phn) err += validationErrors.phn + "\n";

            return res.status(400).json({ error: err, donavigate: false });
          }

          let Available_Slots = makestring(starttime, endtime, no_of_tables1);
          let time = starttime.toString() + " - " + endtime.toString();
          let manager = await Managers.findOne({ email: curruseremail });
          let managerId = manager._id;

          const today = new Date().toLocaleDateString();
          const currentDate = today.split(",")[0];

          let result = new Hotels({
            managerId,
            name,
            address,
            timeday,
            time,
            cuisines,
            avg_cost: avg_cost1,
            Mustorder,
            ModeOfPayment,
            Phone: Phone1,
            Email,
            fulladdress,
            no_of_tables: no_of_tables1,
            Features,
            Available_Slots,
            lastupdated: currentDate,
          });

          console.log("Final added before hotel");
          result = await result.save();

          const hotelId = result._id;

          const updateImageFilenames = async (fieldName) => {
            const filename = req.files[fieldName][0].filename;
            const newFilename = `${hotelId}_${fieldName}.jpg`;

            fs.rename(
              path.join(__dirname, "../uploads", filename),
              path.join(__dirname, "../uploads", newFilename),
              (err) => {
                if (err) throw err;
              }
            );

            return newFilename;
          };

          const image1Filename = await updateImageFilenames("img1");
          const image2Filename = await updateImageFilenames("img2");

          await Hotels.findByIdAndUpdate(hotelId, {
            image1: image1Filename,
            image2: image2Filename,
          });

          console.log("Final added hotel, ");
          return res.status(200).json(result);
        } catch (e) {
          console.log("error : ", e);
          return res.status(400).json({ error: e });
        }
      });
    });
  } catch (e) {
    console.log("error : ", e);
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};

module.exports = {
  managerSignup,
  managerGetOtp_signup,
  managerVerifyOtpController,
  managerLogin,
  managerForgotPassword,
  managerGetOtp_forgotpassword,
  Update_Manager_Info,
  get_ManagerInfo_and_HotelInfo,
  addHotel,
};
