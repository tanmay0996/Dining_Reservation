const express = require("express");
const router = express.Router();
const { userSignup, userlogin } = require("../controllers/userController");

router.post("/usersignup", userSignup);
router.post("/userlogin", userlogin);

module.exports = router;
