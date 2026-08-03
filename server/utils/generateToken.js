const jwt = require("jsonwebtoken");

/**
 * Signs a short-lived access token carrying the user's id and role.
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

/**
 * Signs a longer-lived refresh token, used only to mint new access tokens.
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d" }
  );
};

/**
 * Attaches the access token as a secure, httpOnly cookie AND returns it in the
 * JSON body so SPA clients can also keep it in memory if they prefer header-based auth.
 */
const sendTokenResponse = (user, statusCode, res, message = "Success") => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const cookieExpiresDays = Number(process.env.JWT_COOKIE_EXPIRES_DAYS || 1);

  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000),
    httpOnly: true, // not accessible via client-side JS — mitigates XSS token theft
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res
    .status(statusCode)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    .json({
      success: true,
      statusCode,
      message,
      data: {
        user: user.toSafeObject ? user.toSafeObject() : user,
        accessToken,
      },
    });
};

module.exports = { generateAccessToken, generateRefreshToken, sendTokenResponse };
