const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../envs/environment");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookiesFromRequest = req.cookies;
    const { token } = cookiesFromRequest;
    if (!token) {
      return res.status(401).json({ ERROR: "Invalid token..." });
    }
    const decodedToken = jwt.verify(token, SECRET_KEY);
    if (!decodedToken) {
      return res.status(401).json({ ERROR: "Invalid token..." });
    }
    const { _id } = decodedToken;
    const user = await User.findById(_id);
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ ERROR: err.message });
  }
};

module.exports = {
  userAuth,
};
