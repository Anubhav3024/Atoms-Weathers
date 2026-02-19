"use client";
import React, { useState } from "react";
import { Search, MapPin, Loader2, History } from "lucide-react";
import { motion } from "framer-motion";
import { useWeatherStore } from "@/store/weatherStore";
import {
  fetchWeather,
  fetchForecast,
  fetchWeatherByCoords,
  fetchForecastByCoords,
} from "@/services/api";
import { processForecast, interpolateHourlyData } from "@/services/utils";
import SearchHistory from "./SearchHistory";
import Loader from "./Loader";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const {
    setWeather,
    setLoading,
    setError,
    setCity,
    loading,
    units,
    addToHistory,
  } = useWeatherStore();

  const performSearch = async (target: string) => {
    if (!target.trim()) return;

    setLoading(true);
    setError(null);
    setShowHistory(false);

    try {
      // Create a 2-second delay promise
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 2000));

      // Parallel fetch: API calls + 2s delay
      const [weatherRes, forecastRes] = await Promise.all([
        fetchWeather(target, units),
        fetchForecast(target, units),
        delayPromise, // Wait for at least 2s
      ]);

      const forecastList = forecastRes.data.list;
      setWeather(
        weatherRes.data,
        processForecast(forecastList),
        interpolateHourlyData(forecastList), // Generate 24 hourly points
      );

      setCity(target);
      localStorage.setItem("ws-city", target);
      addToHistory(target);
      setQuery("");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "City not found. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleHistorySelect = (city: string) => {
    setQuery(city);
    performSearch(city);
  };

  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Fetch weather by coords
          const [weatherRes, forecastRes] = await Promise.all([
            fetchWeatherByCoords(latitude, longitude, units),
            fetchForecastByCoords(latitude, longitude, units),
          ]);

          const forecastList = forecastRes.data.list;
          const weatherData = weatherRes.data;

          setWeather(
            weatherData,
            processForecast(forecastList),
            interpolateHourlyData(forecastList),
          );

          setCity(weatherData.name);
          addToHistory(weatherData.name);
          localStorage.setItem("ws-city", weatherData.name);
        } catch (err: any) {
          setError("Unable to retrieve weather for your location");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Unable to retrieve your location");
        setLoading(false);
      },
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-40">
      <motion.form
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSearch}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1 group">
          <input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            className="w-full h-12 pl-12 pr-4 rounded-2xl glass-card text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent/50 outline-none transition-all"
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors"
            size={20}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className={`h-12 w-12 flex items-center justify-center rounded-2xl glass-card transition-all ${
            showHistory
              ? "text-accent border-accent"
              : "text-text-muted hover:text-text-primary"
          }`}
          title="Search History"
        >
          <History size={20} />
        </button>

        <button
          type="button"
          onClick={handleGeoLocation}
          className="h-12 w-12 flex items-center justify-center rounded-2xl glass-card text-text-muted hover:text-text-primary hover:bg-white/10 transition-all"
          title="Use my location"
        >
          <MapPin size={20} />
        </button>

        <button
          type="submit"
          disabled={loading}
          className="h-12 px-6 rounded-2xl bg-accent hover:bg-accent-light text-white font-medium shadow-lg shadow-accent/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-25"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : "Search"}
        </button>
      </motion.form>

      {/* History Dropdown */}
      {showHistory && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowHistory(false)}
          />
          <div className="relative z-40">
            <SearchHistory
              onClose={() => setShowHistory(false)}
              onSelect={handleHistorySelect}
            />
          </div>
        </>
      )}
    </div>
  );
}
