const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const { errorHandler, notFound } = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");
const trackVisit = require("./middleware/trackVisit");
const apiRoutes = require("./routes/index");

const app = express();

// Parse JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Trust proxy (needed for correct req.ip behind Nginx/Heroku/Render/etc.) ----
app.set("trust proxy", 1);

// ---- Security headers ----
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow Cloudinary images to be embedded cross-origin
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "https://res.cloudinary.com",
          "https://images.unsplash.com",
        ],
        connectSrc: [
          "'self'",
          ...(process.env.CLIENT_URL || "").split(",").map((v) => v.trim()),
          ...(process.env.ADMIN_URL || "").split(",").map((v) => v.trim()),
        ].filter(Boolean),
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // would otherwise block third-party Cloudinary/Google Maps embeds
  }),
);

// ---- CORS ----
// ---- CORS ----
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",

  "https://bojanamsbiryani.com",
  "https://www.bojanamsbiryani.com",

  "https://admin.bojanamsbiryani.com",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(
    ...process.env.CLIENT_URL.split(",").map((o) => o.trim()),
  );
}

if (process.env.ADMIN_URL) {
  allowedOrigins.push(...process.env.ADMIN_URL.split(",").map((o) => o.trim()));
}

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (origin && origin.endsWith(".vercel.app"))
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  }),
);

// ---- Sanitize against NoSQL injection ($ and . operator injection) ----
app.use(mongoSanitize());

// ---- Strip/escape any HTML or script content from user input (XSS defense) ----
app.use(require("./middleware/sanitizeInput"));

// ---- Prevent HTTP parameter pollution ----
app.use(hpp());

// ---- Response compression ----
app.use(compression());

// ---- Request logging ----
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ---- Global rate limiting ----
app.use("/api", apiLimiter);

// ---- Lightweight visitor analytics ----
app.use(trackVisit);

// ---- API routes ----
const API_BASE = process.env.API_BASE_PATH || "/api/v1";
app.use(API_BASE, apiRoutes);

// ---- Root ----
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Restaurant Website API is running",
    docs: `${API_BASE}/health`,
  });
});

// ---- 404 + centralized error handling (must be last) ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
