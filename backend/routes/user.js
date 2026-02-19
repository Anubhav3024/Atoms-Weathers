const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// @route   GET api/user/data
// @desc    Get all user weather data (favorites, history, alerts)
router.get("/data", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST api/user/favorite
// @desc    Add or remove a city from favorites
router.post("/favorite", auth, async (req, res) => {
  const { city } = req.body;
  try {
    const user = await User.findById(req.user);
    const index = user.favorites.indexOf(city);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(city);
    }
    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST api/user/history
// @desc    Add a city to search history
router.post("/history", auth, async (req, res) => {
  const { city } = req.body;
  try {
    const user = await User.findById(req.user);
    // Keep only last 10
    user.searchHistory.unshift({ city });
    if (user.searchHistory.length > 10) user.searchHistory.pop();
    await user.save();
    res.json(user.searchHistory);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST api/user/alert
// @desc    Create a custom climatic alert
router.post("/alert", auth, async (req, res) => {
  const { city, targetTime, message } = req.body;
  try {
    const user = await User.findById(req.user);
    user.alerts.push({ city, targetTime, message });
    await user.save();
    res.json(user.alerts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE api/user/alert/:id
// @desc    Remove an alert
router.delete("/alert/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    user.alerts = user.alerts.filter((a) => a._id.toString() !== req.params.id);
    await user.save();
    res.json(user.alerts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update User Profile
router.put("/update", auth, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (email) {
      // Check if email is taken by another user
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== req.user.id) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (password) {
      user.password = password; // Will be hashed by pre-save hook
    }

    await user.save();

    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      preferences: user.preferences,
      favorites: user.favorites,
      searchHistory: user.searchHistory,
      alerts: user.alerts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
