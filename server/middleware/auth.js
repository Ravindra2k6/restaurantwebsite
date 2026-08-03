const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

/**
 * Protects routes: requires a valid access token, either as a Bearer header
 * or as an httpOnly cookie. Attaches the authenticated user to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, "Not authorized — no token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Session expired — please log in again");
    }
    throw new ApiError(401, "Not authorized — invalid token");
  }

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new ApiError(401, "The user belonging to this token no longer exists");
  }

  if (!currentUser.isActive) {
    throw new ApiError(403, "This account has been deactivated");
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    throw new ApiError(401, "Password was recently changed — please log in again");
  }

  req.user = currentUser;
  next();
});

/**
 * Role-based access control. Usage: restrictTo("superadmin", "admin")
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Not authorized");
    }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to perform this action");
    }
    next();
  };
};

/**
 * Optional auth: attaches req.user if a valid token is present, but does not
 * block the request if there isn't one. Useful for public routes that want
 * to slightly change behavior for logged-in staff (e.g. showing draft items).
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (currentUser && currentUser.isActive) {
      req.user = currentUser;
    }
  } catch (err) {
    // Silently ignore invalid tokens for optional auth
  }
  next();
});

module.exports = { protect, restrictTo, optionalAuth };
