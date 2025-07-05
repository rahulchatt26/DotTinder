const express = require("express");
const { userAuth } = require("../middleware/auth");
const {
  validateProfileData,
  validateChangePassword,
} = require("../utils/validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ message: "Users fetched successfully", data: user });
  } catch (err) {
    return res.status(400).json({ ERROR: err.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateProfileData(req);

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((field) => {
      loggedInUser[field] = req.body[field];
    });
    await loggedInUser.save();
    return res.status(200).json({
      message: `${loggedInUser.firstName}, your profile has been updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    return res.status(400).json({ ERROR: err.message });
  }
});

profileRouter.post("/profile/password", userAuth, async (req, res) => {
  try {
    validateChangePassword(req);

    const loggedInUser = req.user;
    const encryptrdNewPassword = await bcrypt.hash(req.body.password, 10);
    loggedInUser.password = encryptrdNewPassword;

    await loggedInUser.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(400).json({ ERROR: err.message });
  }
});

module.exports = profileRouter;
