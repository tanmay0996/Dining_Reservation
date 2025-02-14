const generateSignupOtpEmail = (otp) => {
  return `
    <div style="max-width: 500px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #333; text-align: center;">🎉 Welcome to Our Platform!</h2>
      <p style="font-size: 16px; color: #555;">Hello,</p>
      <p style="font-size: 16px; color: #555;">Thank you for signing up! Please use the OTP below to verify your email:</p>
      
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 22px; font-weight: bold; color: #008CBA; background: #f3f3f3; padding: 10px 20px; border-radius: 8px; display: inline-block;">
          ${otp}
        </span>
      </div>

      <p style="font-size: 16px; color: #555;">This OTP is valid for <b>5 minutes</b>. If you did not sign up, please ignore this email.</p>
    </div>
    `;
};

const generateForgotPasswordOtpEmail = (otp) => {
  return `
    <div style="max-width: 500px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #333; text-align: center;">🔐 Password Reset Request</h2>
      <p style="font-size: 16px; color: #555;">Hello,</p>
      <p style="font-size: 16px; color: #555;">We received a request to reset your password. Use the OTP below to proceed:</p>
      
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 22px; font-weight: bold; color: #008CBA; background: #f3f3f3; padding: 10px 20px; border-radius: 8px; display: inline-block;">
          ${otp}
        </span>
      </div>
  
      <p style="font-size: 16px; color: #555;">This OTP is valid for <b>5 minutes</b>. If you did not request a password reset, please ignore this email.</p>
      
    </div>
    `;
};

module.exports = { generateSignupOtpEmail, generateForgotPasswordOtpEmail };
