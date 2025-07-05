const express = require("express");
const User = require("../models/user");
const { validateSignUpData, validateLoginData } = require("../utils/validator");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const password = req.body.password;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: encryptedPassword,
      age: req.body.age,
      gender: req.body.gender,
      about: req.body.about,
      skills: req.body.skills,
      photoUrl: req.body.photoUrl,
    });

    const createdUser = await user.save();
    res.status(201).json({
      message: "User created successfully",
      data: createdUser,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ ERROR: "User exists with this emailId" });
    } else {
      return res.status(400).json({ ERROR: err.message });
    }
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLoginData(req);
    const emailId = req.body.emailId;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).json({ ERROR: "User not found" });
    }
    if (user.emailId !== req.body.emailId) {
      return res.status(400).json({ ERROR: "Email ID does not match" });
    }
    const isPasswordValid = await user.encryptPassword(req.body.password);
    if (!isPasswordValid) {
      return res.status(400).json({ ERROR: "Invalid password" });
    } else {
      const jwtToken = await user.getJWT();
      res.cookie("token", jwtToken, {
        expires: new Date(Date.now() + 3600000),
      });
      return res.status(200).json({ message: "Login successful" });
    }
  } catch (err) {
    return res.status(400).json({ ERROR: err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res
      .cookie("token", null, { expires: new Date(Date.now()) })
      .status(200)
      .json({ message: "Logout successful" });
  } catch (err) {
    return res.status(400).json({ ERROR: err.message });
  }
});

module.exports = authRouter;
