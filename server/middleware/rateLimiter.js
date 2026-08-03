const rateLimit = require("express-rate-limit");

/**
 * General API rate limiter — applied globally in app.js.
 */
const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 15) * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 200),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests from this IP, please try again later.",
  },
});

/**
 * Stricter limiter for authentication routes to slow down brute-force
 * login/password-reset attempts.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many authentication attempts. Please try again in 15 minutes.",
  },
});

/**
 * Looser limiter for public write actions like contact form / newsletter
 * signup / reservations, to deter spam without blocking real customers.
 */
const publicWriteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many submissions from this IP. Please try again later.",
  },
});

module.exports = { apiLimiter, authLimiter, publicWriteLimiter };
