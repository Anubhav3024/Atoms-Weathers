import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

// Components
import ThemeSwitch from "./components/ThemeSwitch";
import SearchBar from "./components/SearchBar";
import LoaderOverlay from "./components/LoaderOverlay";
import CurrentWeather from "./components/CurrentWeather";
import ForecastSection from "./components/ForecastSection";
import AuthOverlay from "./components/AuthOverlay";
import HourlyForecast from "./components/HourlyForecast";
import WeatherMap from "./components/WeatherMap";
import SettingsPanel from "./components/SettingsPanel";
import { SkeletonCurrent, SkeletonForecast } from "./components/SkeletonCard";
import { processForecast } from "./utils/weatherUtils";

function App() {
  const [isNightMode, setIsNightMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [city, setCity] = useState(
    localStorage.getItem("weatherLastCity") || "",
  );
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [units, setUnits] = useState("metric");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem("weatherTheme");
    if (savedTheme === "night") {
      setIsNightMode(true);
      document.body.classList.add("night-mode");
    }

    // User session initialization
    const token = localStorage.getItem("weatherToken");
    if (token) {
      // Mock fetch user data - in a real app, verify token via API
      const savedUser = JSON.parse(localStorage.getItem("weatherUser"));
      if (savedUser) {
        setUser(savedUser);
        setFavorites(savedUser.favorites || []);
        if (savedUser.preferences?.units) setUnits(savedUser.preferences.units);
      }
    }
  }, []);

  const getBackgroundClass = () => {
    if (!weatherData) return "";
    const main = weatherData.weather[0].main.toLowerCase();
    if (main.includes("clear")) return "bg-clear";
    if (main.includes("cloud")) return "bg-clouds";
    if (main.includes("rain") || main.includes("drizzle")) return "bg-rain";
    if (main.includes("snow")) return "bg-snow";
    if (main.includes("thunderstorm")) return "bg-storm";
    return "";
  };

  const toggleFavorite = async (targetCity) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    const token = localStorage.getItem("weatherToken");
    const isFav = favorites.includes(targetCity);
    try {
      const method = isFav ? "delete" : "post";
      const BASE_API =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await axios({
        method,
        url: `${BASE_API}/favorites`,
        data: { token, city: targetCity },
      });
      setFavorites(res.data.favorites);
      // Update local user object
      const updatedUser = { ...user, favorites: res.data.favorites };
      setUser(updatedUser);
      localStorage.setItem("weatherUser", JSON.stringify(updatedUser));
    } catch {
      setError("Failed to update favorites");
    }
  };

  const toggleTheme = () => {
    const newMode = !isNightMode;
    setIsNightMode(newMode);
    document.body.classList.toggle("night-mode", newMode);
    localStorage.setItem("weatherTheme", newMode ? "night" : "day");
  };

  const handleSearch = async (searchCity) => {
    if (!searchCity) return;
    setLoading(true);
    setError(null);
    document.body.classList.add("loading-blur");

    try {
      const BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      const [currentRes, forecastRes] = await Promise.all([
        axios.get(
          `${BASE_URL}/weather?city=${encodeURIComponent(searchCity)}&units=${units}`,
        ),
        axios.get(
          `${BASE_URL}/forecast?city=${encodeURIComponent(searchCity)}&units=${units}`,
        ),
      ]);

      setWeatherData(currentRes.data);
      setForecastData(processForecast(forecastRes.data.list));
      setHourlyData(forecastRes.data.list.slice(0, 8)); // Next 24 hours (3-hour chunks * 8)
      localStorage.setItem("weatherLastCity", searchCity);
      setCity(searchCity);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
      document.body.classList.remove("loading-blur");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("weatherToken");
    setUser(null);
  };

  return (
    <div className={`app-container ${getBackgroundClass()}`}>
      <header>
        <div className="logo">
          <h1>WeatherSky</h1>
          <p>Industry-Standard Real-Time Forecasts</p>
        </div>
        <div className="header-controls">
          {user ? (
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <button className="user-btn" onClick={handleLogout}>
                <i className="bi bi-person-circle"></i> {user.username}
              </button>
              <button
                className="settings-btn"
                onClick={() => setShowSettings(true)}
              >
                <i className="bi bi-gear-fill"></i>
              </button>
              <ThemeSwitch
                isNightMode={isNightMode}
                toggleTheme={toggleTheme}
              />
            </div>
          ) : (
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <button className="user-btn" onClick={() => setShowAuth(true)}>
                Login / Sign Up
              </button>
              <button
                className="settings-btn"
                onClick={() => setShowSettings(true)}
              >
                <i className="bi bi-gear-fill"></i>
              </button>
              <ThemeSwitch
                isNightMode={isNightMode}
                toggleTheme={toggleTheme}
              />
            </div>
          )}
        </div>
      </header>

      <SearchBar onSearch={handleSearch} initialValue={city} />

      {user && favorites.length > 0 && (
        <div className="favorites-bar">
          {favorites.map((fav) => (
            <button
              key={fav}
              className="fav-chip"
              onClick={() => handleSearch(fav)}
            >
              <i className="bi bi-geo-alt"></i> {fav}
            </button>
          ))}
        </div>
      )}

      <div className="status-area">
        {error && (
          <div id="error-banner" style={{ display: "block" }}>
            {error}
          </div>
        )}
      </div>

      {loading && !weatherData && (
        <>
          <SkeletonCurrent />
          <SkeletonForecast />
        </>
      )}

      {weatherData && (
        <CurrentWeather
          data={weatherData}
          isFavorite={favorites.includes(weatherData.name)}
          onToggleFavorite={() => toggleFavorite(weatherData.name)}
        />
      )}

      {weatherData && (
        <WeatherMap
          lat={weatherData.coord.lat}
          lon={weatherData.coord.lon}
          cityName={weatherData.name}
        />
      )}

      {hourlyData.length > 0 && <HourlyForecast hourlyData={hourlyData} />}

      {forecastData.length > 0 && <ForecastSection forecast={forecastData} />}

      <LoaderOverlay active={loading} />

      {showAuth && (
        <AuthOverlay
          onLogin={(userData) => setUser(userData)}
          onClose={() => setShowAuth(false)}
        />
      )}

      {showSettings && (
        <SettingsPanel
          units={units}
          setUnits={setUnits}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
