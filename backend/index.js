require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/weather", require("./routes/weather"));
app.use("/api/user", require("./routes/user")); // For favorites, history, alerts

// Basic Route
app.get("/", (req, res) => {
  res.json({ message: "WeatherSky API is running..." });
});

// Database Connection
// Only connect if URI is provided, otherwise skip for local demo
if (
  process.env.MONGODB_URI &&
  process.env.MONGODB_URI !== "your_mongodb_atlas_uri_here"
) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Successfully connected to MongoDB Atlas"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      console.log(
        "Check if your IP is whitelisted in MongoDB Atlas (0.0.0.0/0)",
      );
    });
} else {
  console.log(
    "⚠️ MONGODB_URI not found or using placeholder. Running without a real database.",
  );
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
