const express = require("express");
const requestRouter = express.Router();
const { useAuth } = require("../middlewares/userAuth");

requestRouter.post("/connReq", useAuth, (req, res, next) => {
  try {
    res.send("Connected successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
module.exports = { requestRouter };
