const express = require("express");
const { userAuth } = require("../middleware/auth");

const profileRouter = express.Router();

profileRouter.get("/user", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ message: "Users fetched successfully", data: user });
  } catch (err) {
    return res.status(400).json({ ERROR: err.message });
  }
});

module.exports = profileRouter;
