const express = require("express");
const router = express.Router();
const axios = require("axios");

// OpenWeather API key from environment variables
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// @route   GET api/weather/current
// @desc    Proxy to fetch current weather data (by city or coordinates)
router.get("/current", async (req, res) => {
  const { city, lat, lon, units = "metric" } = req.query;

  // Support both city name and coordinates
  if (!city && (!lat || !lon)) {
    return res
      .status(400)
      .json({ message: "City name or coordinates (lat, lon) are required" });
  }

  try {
    const params = {
      appid: API_KEY,
      units,
    };

    // Use coordinates if provided, otherwise use city name
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    } else {
      params.q = city;
    }

    const response = await axios.get(`${BASE_URL}/weather`, { params });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      message: err.response?.data?.message || "Error fetching weather data",
    });
  }
});

// @route   GET api/weather/forecast
// @desc    Proxy to fetch 5-day forecast data (by city or coordinates)
router.get("/forecast", async (req, res) => {
  const { city, lat, lon, units = "metric" } = req.query;

  // Support both city name and coordinates
  if (!city && (!lat || !lon)) {
    return res
      .status(400)
      .json({ message: "City name or coordinates (lat, lon) are required" });
  }

  try {
    const params = {
      appid: API_KEY,
      units,
    };

    // Use coordinates if provided, otherwise use city name
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    } else {
      params.q = city;
    }

    const response = await axios.get(`${BASE_URL}/forecast`, { params });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      message: err.response?.data?.message || "Error fetching forecast data",
    });
  }
});

module.exports = router;
