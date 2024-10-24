const mongoose = require("mongoose");
const validator = require("validator");
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

const User = mongoose.model("User", userSchema);
module.exports = { User };
