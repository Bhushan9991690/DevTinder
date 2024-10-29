const express = require("express");
const userRouter = express.Router();
const { ConnectionRequest } = require("../models/connectionRrequest");
const { useAuth } = require("../middlewares/userAuth");
const details = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "skills",
  "about",
  "photoURL",
];
userRouter.get("/user/request/received", useAuth, async (req, res) => {
  // interested user's in profile

  try {
    const loggedIn = req.user._id;
    const users = await ConnectionRequest.find({
      status: "interested",
      toUserId: loggedIn,
    }).populate("fromUserId", details);
    if (users.length == 0) {
      throw new Error("No reequest available!");
    }
    res.json({ message: "Fetch successfully", data: users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/user/request/accepted", useAuth, async (req, res) => {
  // Accepted the user's profile
  try {
    const loggIn = req.user._id;
    const acceptedUser = await ConnectionRequest.find({
      // A -> B ,accepted
      // B -> A ,accepted
      status: "accepted",
      $or: [
        {
          fromUserId: loggIn,
        },
        {
          toUserId: loggIn,
        },
      ],
    })
      .populate("fromUserId", details)
      .populate("toUserId", details);

    const data = acceptedUser.map((row) => {
      if (row.fromUserId._id.equals(loggIn)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data: data });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = { userRouter };
