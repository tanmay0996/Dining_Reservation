const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = process.env.secretKey;
const generatePassword = require("../utils/generatePassword");

const userSignup = async (req, res) => {
  try {
    const { username, email, pwd, phn } = req.body;
    if (!username || !email || !phn || !pwd) {
      return res.status(400).json({ error: "Fill Up the form" });
    }

    req.body.pwd = generatePassword(pwd);

    let userExists = await Users.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User Exists" });
    }

    let user = await Users.create(req.body);
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      secretKey
    );

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      })
      .json({ userId: user._id, username: user.username, email: user.email });
  } catch (e) {
    console.error("Error in user sign-up:", e);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

const userlogin = async (req, res) => {
  try {
    const { email, pwd } = req.body;
    if (!email || !pwd) {
      return res.status(400).json({ error: "Fill Up the form" });
    }

    const user = await Users.findOne({ email });

    if (user) {
      const result = await bcrypt.compare(pwd, user.pwd);

      if (result) {
        const token = jwt.sign(
          { userId: user._id, username: user.username, email: user.email },
          secretKey
        );

        res
          .cookie("token", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          })
          .json({
            userId: user._id,
            username: user.username,
            email: user.email,
          });
      } else {
        return res.status(401).json({ error: "Incorrect password" });
      }
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (e) {
    console.log(e);
    res.json({ error: "Something Went Wrong" });
  }
};

module.exports = { userSignup, userlogin };
