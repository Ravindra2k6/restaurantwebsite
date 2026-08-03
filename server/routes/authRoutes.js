const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
  refreshAccessToken,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const { protect, restrictTo } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updatePasswordValidator,
} = require("../validators/authValidator");

// Public
router.post("/login", authLimiter, loginValidator, validate, login);
router.post("/refresh", refreshAccessToken);
router.post("/forgot-password", authLimiter, forgotPasswordValidator, validate, forgotPassword);
router.patch("/reset-password/:token", authLimiter, resetPasswordValidator, validate, resetPassword);

// Private
router.post(
  "/register",
  protect,
  restrictTo("superadmin", "admin"),
  registerValidator,
  validate,
  register
);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.patch("/update-password", protect, updatePasswordValidator, validate, updatePassword);

module.exports = router;
