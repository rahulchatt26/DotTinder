const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const validator = require("validator");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender skills about photoUrl";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const interestedConnectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    return res.status(200).json({
      message: "Connection requests fetched successfully",
      data: interestedConnectionRequest,
    });
  } catch (err) {
    return res.status(400).json({ ERROR: err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const userConnections = connections.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return connection.toUserId;
      } else {
        return connection.fromUserId;
      }
    });

    res.status(200).json({
      message: "Connections fetched successfully",
      data: userConnections,
    });
  } catch (err) {
    return res.status(400).json({ ERROR: err.message });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const isPageNumeric = validator.isNumeric(req.query.page);
    const isLimitNumeric = validator.isNumeric(req.query.limit);
    if (!isPageNumeric || !isLimitNumeric) {
      return res.status(400).json({
        ERROR: "Page and limit must be numeric values",
      });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let skip = (page - 1) * limit;
    skip = skip > 50 ? 50 : skip;

    const loggedInUser = req.user;

    const connectionRequestsSentOrRecieved = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequestsSentOrRecieved.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });

    const showUsersInFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Feed fetched successfully",
      data: showUsersInFeed,
    });
  } catch (err) {
    return res.status(400).json({ ERROR: err.message });
  }
});

module.exports = userRouter;
