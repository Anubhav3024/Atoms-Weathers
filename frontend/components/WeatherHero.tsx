"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Heart,
  Share2,
  Droplets,
  Wind,
  Eye,
  Gauge,
  BellPlus,
} from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";
import {
  formatTemp,
  getBgGradient,
  getWindDirection,
  formatDate,
} from "@/services/utils";
// import { addFavorite, removeFavorite } from "@/services/api";
import AlertModal from "./AlertModal";
import WeatherIcon from "./WeatherIcon";

export default function WeatherHero() {
  const { current, units, user, token, toggleFavorite } = useWeatherStore();
  const [showAlertModal, setShowAlertModal] = useState(false);

  if (!current) return null;

  // We can use the store's toggleFavorite if it handles API calls,
  // but looking at previous code, it might be a simple state update.
  // The store definition has `toggleFavorite` which updates local state?
  // Let's check `weatherStore.ts`... `toggleFavorite` is declared but not implemented in my recent view.
  // Wait, I saw `setFavorites`.
  // The previous `WeatherHero` had a local `toggleFav` function that called API.
  // I should preserve that logic or move it to store.
  // For now, I'll keep the local logic to ensure it works with the API.

  const isFavorite = user?.favorites?.includes(current.name) || false;

  const handleToggleFavorite = async () => {
    if (!user) {
      alert("Please login to save favorites.");
      return;
    }
    if (!token) return;
    toggleFavorite(current.name);
  };

  const dateStr = new Date(current.dt * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-3xl p-8 bg-linear-to-br ${getBgGradient(current.weather[0].main)}`}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm" />

        <div className="relative z-10 text-text-primary dark:text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={20} />
                <h2 className="text-2xl font-bold tracking-wide">
                  {current.name}, {current.sys.country}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <Calendar size={14} />
                <span>{dateStr}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAlertModal(true)}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all active:scale-95"
                title="Add Alert/Note"
              >
                <BellPlus size={20} />
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`p-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all active:scale-95 ${
                  isFavorite ? "text-red-400" : "text-white"
                }`}
                title={
                  isFavorite ? "Remove from Favorites" : "Add to Favorites"
                }
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all active:scale-95 text-white"
                title="Share"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-4">
                <div className="text-6xl md:text-8xl drop-shadow-lg filter grayscale-0">
                  <WeatherIcon code={current.weather[0].icon} size={84} />
                </div>
                <div>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-text-primary dark:text-white">
                    {formatTemp(current.main.temp, units)}
                  </h1>
                  <p className="text-xl font-medium capitalize opacity-90 -mt-1.25">
                    {current.weather[0].description}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <DetailCard
                icon={<Droplets />}
                label="Humidity"
                value={`${current.main.humidity}%`}
              />
              <DetailCard
                icon={<Wind />}
                label="Wind"
                value={`${current.wind.speed} ${units === "metric" ? "m/s" : "mph"}`}
                subValue={getWindDirection(current.wind.deg)}
              />
              <DetailCard
                icon={<Eye />}
                label="Visibility"
                value={`${(current.visibility / 1000).toFixed(1)} km`}
              />
              <DetailCard
                icon={<Gauge />}
                label="Pressure"
                value={`${current.main.pressure} hPa`}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showAlertModal && (
          <AlertModal onClose={() => setShowAlertModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function DetailCard({ icon, label, value, subValue }: any) {
  return (
    <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 min-w-35 border border-white/20 shadow-sm">
      <div className="text-text-primary dark:text-white/80">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <p className="text-xs opacity-70 font-medium uppercase tracking-wider text-text-secondary dark:text-white/60">
          {label}
        </p>
        <p className="text-lg font-bold text-text-primary dark:text-white">
          {value}
        </p>
        {subValue && (
          <p className="text-xs opacity-70 text-text-secondary dark:text-white/60">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}
