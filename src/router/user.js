const express = require("express");
const userRouter = express.Router();
const { ConnectionRequest } = require("../models/connectionRrequest");
const { useAuth } = require("../middlewares/userAuth");
const { set } = require("mongoose");
const { User } = require("../models/user");
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
      throw new Error("No request available!");
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
userRouter.get("/feed", useAuth, async (req, res, next) => {
  // What connection not show in the user Profile
  // 1) Not of my Profile
  // 2) All of my connection Profile
  // 3) All of ignored Profile
  // 4) All of pending Request
  try {
    const loggedIn = req.user._id;
    const getAllConnection = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedIn }, { toUserId: loggedIn }],
    }).select(["fromUserId", "toUserId", "status"]);

    const hideDuplicacyId = new Set();
    getAllConnection.forEach((key) => {
      hideDuplicacyId.add(key.fromUserId.toString());
      hideDuplicacyId.add(key.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideDuplicacyId) },
        },
        { _id: { $ne: loggedIn } },
      ],
    }).select(details);
    if (users.length == 0) {
      return res.json({
        message: "You connected all the users that found in Database!",
      });
    }
    res.json({ data: users });
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
});
module.exports = { userRouter };
