const express = require("express");
const { userAuth } = require("../middleware/auth");
const mongoose = require("mongoose");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const connectionRequestRouter = express.Router();

connectionRequestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const toUserId = req.params.userId;

      const allowedStatusType = ["ignored", "interested"];
      const isValidStatus = allowedStatusType.includes(status);

      if (!isValidStatus) {
        return res.status(400).json({ message: "Invalid status type..." });
      }

      const isValidUserId = mongoose.isValidObjectId(toUserId);
      if (!isValidUserId) {
        return res.status(400).json({ message: "Invalid user id..." });
      }

      const validUser = await User.findById(toUserId);
      if (!validUser) {
        return res.status(400).json({ message: "User not found..." });
      }

      const invalidConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: req.user._id, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: req.user._id },
        ],
      });

      if (invalidConnectionRequest) {
        return res.status(400).json({
          message: `Connect request already sent from ${invalidConnectionRequest.fromUserId} to ${invalidConnectionRequest.toUserId}`,
        });
      }

      const newConnectionRequest = new ConnectionRequest({
        fromUserId: req.user._id,
        toUserId: toUserId,
        status: status,
      });

      const connectionRequest = await newConnectionRequest.save();

      return res.status(200).json({
        message: "Connection request sent successfully",
        data: connectionRequest,
      });
    } catch (err) {
      return res.status(400).json({ ERROR: err.message });
    }
  }
);

connectionRequestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const requestId = req.params.requestId;
      const loggedInUser = req.user;
      const allowedStatusType = ["accepted", "rejected"];

      const isReviewAllowed = allowedStatusType.includes(status);
      if (!isReviewAllowed) {
        return res.status(400).json({ message: "Invalid status type..." });
      }

      const isValidRequestId = mongoose.isValidObjectId(requestId);
      if (!isValidRequestId) {
        return res.status(400).json({ message: "Invalid request id..." });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(400).json({
          message: "Connection request not found or already reviewed.",
        });
      }
      connectionRequest.status = status;

      const reviewedConnectionRequest = await connectionRequest.save();

      return res.status(200).json({
        message: "Connection request reviewed successfully",
        data: reviewedConnectionRequest,
      });
    } catch (err) {
      return res.status(400).json({ ERROR: err.message });
    }
  }
);

module.exports = connectionRequestRouter;
