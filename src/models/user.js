const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String, // String is shorthand for {type: String}
  lastName: String,
  email: String,
  password: String,
  gender: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
