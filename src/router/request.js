const express = require("express");
const requestRouter = express.Router();
const { ConnectionRequest } = require("../models/connectionRrequest");
const { useAuth } = require("../middlewares/userAuth");
const { User } = require("../models/user");
const mongoose = require("mongoose");
requestRouter.post(
  "/request/send/:status/:userId",
  useAuth,
  async (req, res, next) => {
    try {
      const SenderUser = req.user;
      const { status, userId } = req.params;
      const link = new ConnectionRequest({
        fromUserId: SenderUser._id,
        toUserId: userId,
        status: status,
      });

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(404).json({ message: "Invalid Status Type" });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid UserId" });
      }

      const isPresetDB = await User.findById(userId);
      if (!isPresetDB) {
        return res
          .status(400)
          .json({ message: "UserId is not a Valid userId" });
      }

      const isSendRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: SenderUser._id, toUserId: userId },
          {
            fromUserId: userId,
            toUserId: SenderUser._id,
          },
        ],
      });

      if (isSendRequest) {
        return res.status(400).json({ message: "Already send a Request" });
      }
      await link.save();
      res.json({ message: " Request Send Successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);
requestRouter.post(
  "/profile/review/:status/:requestId",
  useAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.json({ message: "Invalid Status type" });
      }
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.json({ message: "Invalid requestId" });
      }
      const findRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: user._id,
        status: "interested",
      });
      if (!findRequest) {
        return res.json({ Message: "No request found!!" });
      }
      findRequest.status = "accepted";
      await findRequest.save();
      res.json({ message: findRequest });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);
requestRouter.post;
module.exports = { requestRouter };
