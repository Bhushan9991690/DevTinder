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
        formUserId: SenderUser._id,
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
          { formUserId: SenderUser._id, toUserId: userId },
          {
            formUserId: userId,
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
module.exports = { requestRouter };
