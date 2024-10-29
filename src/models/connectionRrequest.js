const mongoose = require("mongoose");
const userConnectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} IS NOT SUPPORTED`,
      },
    },
  },
  { timestamps: true }
);

userConnectionSchema.pre("save", async function (next) {
  const user = this;
  if (user.fromUserId.equals(user.toUserId)) {
    throw new Error("Cannot sent request to Yourself");
  }
  next();
});

userConnectionSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  userConnectionSchema
);
module.exports = { ConnectionRequest };
