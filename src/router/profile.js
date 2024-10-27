const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const { useAuth } = require("../middlewares/userAuth");
const { User } = require("../models/user");
const { validateProfileEdit } = require("../utils/validation");
profileRouter.get("/profile/view", useAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
profileRouter.patch("/profile/edit", useAuth, async (req, res) => {
  try {
    validateProfileEdit(req);
    const user = req.user;
    Object.keys(req.body).forEach((k) => {
      return (user[k] = req.body[k]);
    });

    console.log(user);
    await user.save();

    res.send("Updated Successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
profileRouter.patch(
  "/profile/edit/password",
  useAuth,
  async (req, res, next) => {
    try {
      const user = req.user;
      const { password } = req.body;
      const data = ["password"];
      const isAllow = Object.keys(req.body).every((k) => {
        return data.includes(k);
      });
      if (!isAllow) {
        throw new Error("Extra credentails!");
      }
      if (!validator.isStrongPassword(password)) {
        throw new Error("Enter a Strong password!");
      }
      const ismatch = await bcrypt.compare(password, user.password);
      if (ismatch) {
        throw new Error("Enter a new password!");
      }
      const hashNewPassword = await bcrypt.hash(password, 10);
      user.password = hashNewPassword;
      user.save();
      res.send("Your password updated successfully!");
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);
module.exports = { profileRouter };
