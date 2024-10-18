const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const app = express();

app.post("/signup", async (req, res, next) => {
  try {
    const user = new User({
      firstName: "Nikhil",
      lastName: "Saini",
      email: "Nikhil@gmail.com",
      password: "nikhil@123",
      gender: "M",
      age: 22,
    });

    const person = await user.save();
    console.log("Added a New User Successfully!!");
    res.send("User Created Successfully");
  } catch (error) {
    res.status(400).send("User is Not Created Error : ", error);
  }
});

connectDB()
  .then(() => {
    console.log("Server is successfully Connected to DataBase");
    app.listen(7777, () => {
      console.log("Listening server 7777 !");
    });
  })
  .catch((error) => {
    console.log("Server is Not Connected To Database :", error);
  });
