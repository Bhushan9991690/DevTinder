const express = require("express");
const profileRouter = express.Router();
const { useAuth } = require("../middlewares/userAuth");

profileRouter.get("/profile", useAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    res.send("Reading..." + user.firstName);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
module.exports = { profileRouter };
