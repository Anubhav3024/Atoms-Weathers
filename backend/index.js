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
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.log(
    "MONGODB_URI not found or using placeholder. Running without persistent database.",
  );
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
