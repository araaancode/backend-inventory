const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

exports.authUser = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      // extract token from authHeader string
      token = authHeader.split(" ")[1];

      // verified token returns user id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // find user's obj in db and assign to req.user
      let user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
        next();
      } else {
        res.send("you not allowed to do this !!!");
      }
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token found");
  }
});

exports.isUser = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "client") next();
  else res.status(403).json({ message: "Access denied" });
});

exports.isExpert = (req, res, next) => {
  if (req.user && req.user.role === "expert") next();
  else res.status(403).json({ message: "Access denied" });
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Access denied" });
};

exports.isSuperadmin = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") next();
  else res.status(403).json({ message: "Access denied" });
};
