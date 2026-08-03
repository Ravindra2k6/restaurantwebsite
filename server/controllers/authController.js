const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { sendTokenResponse, generateAccessToken } = require("../utils/generateToken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { staffWelcomeEmail } = require("../utils/emailTemplates");
const logActivity = require("../utils/logActivity");

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 15;

/**
 * @desc    Register a new admin/staff account
 * @route   POST /api/v1/auth/register
 * @access  Private (superadmin only — enforced in routes)
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, branch } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const user = await User.create({ name, email, password, role, branch });

  sendEmail({
    to: email,
    subject: "Your Admin Panel Account is Ready",
    html: staffWelcomeEmail({
      name,
      email,
      role,
      siteName: "Bhojanams & Biryanis",
      loginUrl: `${process.env.ADMIN_URL || ""}/login`,
    }),
  });

  logActivity(req, {
    action: "create",
    entityType: "User",
    entityId: user._id,
    description: `Created staff account for "${name}" (${role})`,
  });

  sendTokenResponse(user, 201, res, "Account created successfully");
});

/**
 * @desc    Log in with email + password
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid email or password");

  if (user.isLocked) {
    throw new ApiError(
      423,
      `Account temporarily locked due to repeated failed logins. Try again after ${new Date(
        user.lockUntil
      ).toLocaleTimeString()}`
    );
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = Date.now() + LOCK_TIME_MINUTES * 60 * 1000;
    }
    await user.save({ validateBeforeSave: false });
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) throw new ApiError(403, "This account has been deactivated");

  user.loginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  req.user = user; // logActivity reads req.user; not yet set by middleware at login time
  logActivity(req, {
    action: "login",
    entityType: "User",
    entityId: user._id,
    description: `${user.name} logged in`,
  });

  sendTokenResponse(user, 200, res, "Logged in successfully");
});

/**
 * @desc    Log out — clears auth cookies
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  res
    .cookie("accessToken", "none", { expires: new Date(Date.now() + 1000), httpOnly: true })
    .cookie("refreshToken", "none", { expires: new Date(Date.now() + 1000), httpOnly: true })
    .status(200)
    .json(new ApiResponse(200, "Logged out successfully"));
});

/**
 * @desc    Get currently authenticated user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "Fetched current user", req.user.toSafeObject()));
});

/**
 * @desc    Exchange a valid refresh token (cookie) for a new access token
 * @route   POST /api/v1/auth/refresh
 * @access  Public (requires refreshToken cookie)
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError(401, "No refresh token provided");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token — please log in again");
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw new ApiError(401, "User no longer exists or is inactive");

  const accessToken = generateAccessToken(user);
  const cookieExpiresDays = Number(process.env.JWT_COOKIE_EXPIRES_DAYS || 1);

  res
    .cookie("accessToken", accessToken, {
      expires: new Date(Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .status(200)
    .json(new ApiResponse(200, "Access token refreshed", { accessToken }));
});

/**
 * @desc    Update password while logged in
 * @route   PATCH /api/v1/auth/update-password
 * @access  Private
 */
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(401, "Current password is incorrect");

  user.password = newPassword;
  await user.save();

  logActivity(req, {
    action: "update",
    entityType: "User",
    entityId: user._id,
    description: `${user.name} changed their password`,
  });

  sendTokenResponse(user, 200, res, "Password updated successfully");
});

/**
 * @desc    Request a password reset token (emailed in production; returned
 *          directly in the response only in development for easy testing)
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  // Always respond the same way whether or not the user exists, to avoid
  // leaking which emails are registered.
  const genericMessage = "If that email is registered, a password reset link has been sent";

  if (!user) {
    return res.status(200).json(new ApiResponse(200, genericMessage));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // TODO (production): send `resetToken` via an email service (e.g. Nodemailer/SendGrid)
  // pointing the user to `${process.env.CLIENT_URL}/reset-password/${resetToken}`

  const payload =
    process.env.NODE_ENV === "development" ? { resetToken } : undefined;

  res.status(200).json(new ApiResponse(200, genericMessage, payload));
});

/**
 * @desc    Reset password using the token from forgotPassword
 * @route   PATCH /api/v1/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, "Token is invalid or has expired");

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, "Password reset successful");
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  refreshAccessToken,
  updatePassword,
  forgotPassword,
  resetPassword,
};
