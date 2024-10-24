const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { validateSignUp } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { useAuth } = require("./middlewares/userAuth");
app.use(cookieParser());
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const { email, password, lastName, firstName } = req.body;
    await validateSignUp(req);

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashPassword,
      lastName,
      firstName,
    });
    await user.save();
    res.send("User created Successfully");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const valid = ["email", "password"];
    const isvalid = Object.keys(req.body).every((k) => {
      return valid.includes(k);
    });

    const user = await User.findOne({ email: email });
    if (!isvalid) {
      throw new Error("Extra details!");
    } else if (!user) {
      throw new Error("Invalid credentails!");
    }

    const isStrongPassword = validator.isStrongPassword(password);
    if (!isStrongPassword) {
      throw new Error("Invalid credentails!");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentails!");
    }
    const token = await jwt.sign({ _id: user._id }, "NodeJs2024");
    res.cookie("Token", token);
    res.send("login successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/profile", useAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    res.send("Reading..."+user.firstName);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/feed", async (req, res, next) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(200).send("No user available!");
    }
    res.send(users);
  } catch (error) {
    res.status(400).send("Something Wrong!");
  }
});

app.get("/user", async (req, res, next) => {
  try {
    const userId = req.body;
    const users = await User.find({ _id: userId });
    if (users.length === 0) {
      res.status(200).send("No user available!");
    }
    res.send(users);
  } catch (error) {
    res.status(400).send("Something Wrong!");
  }
});

app.delete("/user", async (req, res, next) => {
  try {
    const userId = req.body;
    const users = await User.find({ _id: userId });
    if (users.length === 0) {
      res.status(200).send("No user available!");
    }
    const del = await User.findByIdAndDelete({ _id: users[0]._id });
    res.send(del);
  } catch (error) {
    res.status(400).send("Something Wrong inthis!");
  }
});

app.patch("/user", async (req, res, next) => {
  try {
    const data = req.body;
    if (data?.skills.length > 6) {
      throw new Error("skills should not more than 5!");
    }
    const users = await User.find({ _id: data.id });
    if (users.length === 0) {
      res.status(200).send("No user available!");
    }
    const isALLOWED = ["id", "lastName", "password", "photoURL", "skills"];
    const isAllow = Object.keys(data).every((k) => {
      return isALLOWED.includes(k);
    });
    if (!isAllow) {
      throw new Error("Invalid credentails,Update not allowed");
    }
    await User.findByIdAndUpdate({ _id: users[0]._id }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(7777, () => {
      console.log("Listen Server 7777");
    });
  })
  .catch((err) => {
    console.log("Not Connected to DB :", err);
  });
