const mongoose = require("mongoose");

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Exits the process on failure so the app never runs in a broken state.
 */
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Modern mongoose (v6+) no longer needs useNewUrlParser/useUnifiedTopology,
      // but they are harmless to specify for clarity/back-compat.
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect is handled by the driver.");
    });
  } catch (error) {
    console.error(`❌ Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
