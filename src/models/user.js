const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, minLength: 4, maxlength: 50, required: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter the valid Email address");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please make a Strong password");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },

    age: { type: Number, min: 18 },
    photoURL: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("please enter valid URL");
        }
      },
      default:
        "https://w7.pngwing.com/pngs/113/965/png-transparent-demigirl-demi-girl-gender-person-genderqueer-identity-genders-icon.png",
    },
    skills: {
      type: [String],
      lowercase: true,
    },
    about: { type: String },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const jwtToken = await jwt.sign({ _id: user._id }, "NodeJs2024", {
    expiresIn: "7d",
  });
  return jwtToken;
};
userSchema.methods.CheckStrongPassword = async function (passwordByUser) {
  const user = this;
  const hash = await bcrypt.compare(passwordByUser, user.password);
  return hash;
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
