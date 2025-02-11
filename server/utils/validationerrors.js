function errorForUserSignUp(obj) {
  const { email, phn } = obj;
  const errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.email = "Invalid email format.";
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phn)) {
    errors.phn = "Phone number must be exactly 10 digits.";
  }

  return errors;
}

function errorForManagerSignUp(obj) {
  const { email, phn, aadhar, pan } = obj;
  const errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.email = "Invalid email format.";
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phn)) {
    errors.phn = "Phone number must be exactly 10 digits.";
  }

  const aadharRegex = /^\d{12}$/;
  if (!aadharRegex.test(aadhar)) {
    errors.aadhar = "Aadhar number must be exactly 12 digits.";
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(pan)) {
    errors.pan =
      "PAN card must be 10 alphanumeric characters (e.g., ABCDE1234F).";
  }

  return errors;
}

function errorForEmail(email) {
  const errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }
}

module.exports = { errorForUserSignUp, errorForManagerSignUp, errorForEmail };
