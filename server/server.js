const dotenv = require("dotenv");
dotenv.config();

// Fail fast if critical env vars are missing — better than a confusing crash later.
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];
const missing = requiredEnvVars.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
  console.error("   Copy .env.example to .env and fill in the values before starting the server.");
  process.exit(1);
}

const connectDB = require("./config/db");
const app = require("./app");

// ---- Catch synchronous programming errors early ----
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    console.log(`   API base path: ${process.env.API_BASE_PATH || "/api/v1"}`);
  });

  // ---- Catch unhandled promise rejections (e.g. failed DB queries not caught) ----
  process.on("unhandledRejection", (err) => {
    console.error("💥 UNHANDLED REJECTION! Shutting down...");
    console.error(err.name, err.message);
    server.close(() => process.exit(1));
  });

  // ---- Graceful shutdown on SIGTERM (e.g. container orchestrator restarts) ----
  process.on("SIGTERM", () => {
    console.log("👋 SIGTERM received. Shutting down gracefully...");
    server.close(() => console.log("Process terminated"));
  });
};

startServer();
