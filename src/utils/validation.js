const { User } = require("../models/user");
const validator = require("validator");
const validateSignUp = async (req) => {
  const { firstName, lastName, email, password } = req.body;
  const allowField = ["firstName", "lastName", "email", "password"];
  const isallow = Object.keys(req.body).every((k) => {
    return allowField.includes(k);
  });
  if (!firstName || !lastName || !email || !password) {
    throw new Error("Invalid input details");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email address!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password must have {a-z ,A-z ,0-9} & special Character!");
  } else if (!isallow) {
    throw new Error("Invalid input fields");
  }
  const ispresent = await User.find({ email });
  if (ispresent.length > 0) {
    throw new Error("User already present!");
  }
};
module.exports = { validateSignUp };
