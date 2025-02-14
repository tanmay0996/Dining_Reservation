const nodemailer = require("nodemailer");
const otpStorage = new Map();

const {
  generateSignupOtpEmail,
  generateForgotPasswordOtpEmail,
} = require("./emailTemplates");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.OWNER_EMAIL_ID,
    pass: process.env.OWNER_EMAIL_PASSWORD,
  },
});

const sendOtp = async (email, identifier) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStorage.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

  const mailOptions = {
    from: process.env.OWNER_EMAIL_ID,
    to: email,
    subject:
      identifier == "signup" ? "Email Verification OTP" : "Password Reset OTP",
    html:
      identifier == "signup"
        ? generateSignupOtpEmail(otp)
        : generateForgotPasswordOtpEmail(otp),
  };

  await transporter.sendMail(mailOptions);
  return { message: "OTP sent to your email" };
};

const verifyOtp = (email, otp) => {
  const storedOtpData = otpStorage.get(email);
  if (
    !storedOtpData ||
    storedOtpData.otp !== parseInt(otp) ||
    Date.now() > storedOtpData.expires
  ) {
    return { success: false, error: "Invalid or expired OTP" };
  }

  otpStorage.delete(email);
  return { success: true };
};

module.exports = { sendOtp, verifyOtp };
