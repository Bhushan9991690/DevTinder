const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const useAuth = async (req, res, next) => {
  try {
    const { Token } = req.cookies;
    if (!Token) {
      throw new Error("Invalid Token!");
    }
    const userId = await jwt.verify(Token, "NodeJs2024");
    if (!userId) {
      throw new Error("Not a valid token!");
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("Invalid User!");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error : ", error.message);
  }
};
module.exports = { useAuth };
