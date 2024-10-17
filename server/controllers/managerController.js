const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const managersecretKey = process.env.managersecretKey;

const Managers = require("../models/Manager");
const Hotels = require("../models/Hotels");

const generatePassword = require("../utils/generatePassword");

const managerSignup = async (req, res) => {
  try {
    const { name, email, pwd, phn, address, aadhar, pan } = req.body;

    if (!name || !email || !phn || !pwd || !address || !aadhar || !pan) {
      return res.status(400).json({ error: "Fill Up the form" });
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
    res.json({ error: "Something Went Wrong" });
  }
};

const managerLogin = async (req, res) => {
  try {
    const { email, pwd } = req.body;
    if (!email || !pwd) {
      return res.status(400).json({ error: "Fill Up the form" });
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
    res.json({ error: "Something Went Wrong" });
  }
};

const managerForgotPassword = async (req, res) => {
  try {
    let { email, pwd } = req.body;
    if (!email || !pwd) {
      res.status(400).json({ error: "Fill up the Form" });
    } else {
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
        res.status(200).json({ email: req.body.newemail });
      } else {
        res.status(400).json({ error: "Manager not Found" });
      }
    }
  } catch (e) {
    console.error("Error fetching user:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const Update_Manager_Info = async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, managersecretKey, {}, async (err, info) => {
      if (err) throw err;

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
        .json({ name: req.body.newname });
    });
  } catch (e) {
    console.error("Error fetching user:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const get_ManagerInfo_and_HotelInfo = async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, managersecretKey, {}, async (err, info) => {
      if (err) {
        console.log("Got the error");
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

        res.json({ manager, hotels });
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  managerSignup,
  managerLogin,
  managerForgotPassword,
  Update_Manager_Info,
  get_ManagerInfo_and_HotelInfo,
};
