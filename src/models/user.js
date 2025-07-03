const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../envs/environment");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Invalid gender type");
        }
      },
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please Enter a strong password");
        }
      },
    },
    about: {
      type: String,
      default: "DotTinder is a excellent platform to find your dev soulmate",
    },
    skills: {
      type: Array,
      validate(value) {
        if (value.length > 10) {
          throw new Error("You can add a maximum of 10 skills");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://www.w3schools.com/howto/img_avatar.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Please enter a valid photo URL");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, SECRET_KEY, {
    expiresIn: "1D",
  });
  return token;
};

userSchema.methods.encryptPassword = async function (passwordFromReqBody) {
  const user = this;
  const passwordProvidedByUser = passwordFromReqBody;
  const passwordHashFromDb = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordProvidedByUser,
    passwordHashFromDb
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
