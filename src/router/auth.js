const express = require("express");
const authRouter = express.Router();

const { validateSignUp } = require("../utils/validation");
const validator = require("validator");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    const { email, password, lastName, firstName } = req.body;
    await validateSignUp(req);

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashPassword,
      lastName,
      firstName,
    });
    await user.save();
    res.send("User created Successfully");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const valid = ["email", "password"];
    const isvalid = Object.keys(req.body).every((k) => {
      return valid.includes(k);
    });

    const user = await User.findOne({ email: email });
    if (!isvalid) {
      throw new Error("Extra details!");
    } else if (!user) {
      throw new Error("Invalid credentails!");
    }

    const isStrongPassword = validator.isStrongPassword(password);
    if (!isStrongPassword) {
      throw new Error("Invalid credentails!");
    }

    const isMatch = await user.CheckStrongPassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentails!");
    }
    const token = await user.getJWT();
    res.cookie("Token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    res.send("login successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
authRouter.post("/logout", (req, res, next) => {
  res
    .cookie("Token", null, { expires: new Date(Date.now()) })
    .send("LogOut Successfully!");
});

module.exports = { authRouter };
