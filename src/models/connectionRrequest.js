const mongoose = require("mongoose");
const userConnectionSchema = new mongoose.Schema(
  {
    formUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
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
  if (user.formUserId.equals(user.toUserId)) {
    throw new Error("Cannot sent request to Yourself");
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  userConnectionSchema
);
module.exports = { ConnectionRequest };
