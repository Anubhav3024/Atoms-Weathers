import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Navigation,
  Star,
  Plus,
  Clock,
} from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";
import AlertModal from "./AlertModal";
import AuthModal from "./AuthModal";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function Dashboard() {
  const { current, forecast, hourly, toggleFavorite, user } = useWeatherStore();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (!current)
    return (
      <div className="flex flex-col items-center justify-center h-125 text-text-muted">
        <div className="w-20 h-20 rounded-full border-4 border-accent border-t-transparent animate-spin mb-4" />
        <p className="font-bold text-lg">Fetching Weather Data...</p>
      </div>
    );

  const isFavorite = user?.favorites.includes(current.name);

  // Helper to format time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWeatherIcon = (id: number, size = 24, className = "") => {
    if (id >= 200 && id < 300)
      return (
        <CloudLightning
          size={size}
          className={`text-purple-400 ${className}`}
        />
      );
    if (id >= 300 && id < 600)
      return <CloudRain size={size} className={`text-blue-400 ${className}`} />;
    if (id >= 600 && id < 700)
      return <Droplets size={size} className={`text-cyan-200 ${className}`} />;
    if (id === 800)
      return <Sun size={size} className={`text-amber-400 ${className}`} />;
    return <Cloud size={size} className={`text-blue-300 ${className}`} />;
  };

  const handleAlertClick = () => {
    if (user) {
      setIsAlertModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <AnimatePresence>
        {isAlertModalOpen && (
          <AlertModal onClose={() => setIsAlertModalOpen(false)} />
        )}
        {isAuthModalOpen && (
          <AuthModal onClose={() => setIsAuthModalOpen(false)} />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section
        variants={item}
        className="relative overflow-hidden group"
      >
        <div className="glass-card p-10 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
          {/* Animated Background Element */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px] group-hover:bg-accent/20 transition-all duration-700" />

          <div className="flex-1 space-y-4 relative">
            <div className="flex items-center gap-4">
              <h2 className="text-6xl font-black text-text-primary tracking-tighter">
                {current.name}
              </h2>
              <button
                onClick={() => toggleFavorite(current.name)}
                className={`p-3 rounded-2xl transition-all ${isFavorite ? "bg-amber-400/10 text-amber-400" : "bg-bg-primary border border-border text-text-muted hover:text-amber-400"}`}
              >
                <Star size={24} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
            <p className="text-xl text-text-muted font-medium flex items-center gap-2 uppercase tracking-widest">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="flex items-end gap-2">
              <span className="text-8xl font-black text-accent">
                {Math.round(current.main.temp)}°
              </span>
              <span className="text-2xl font-bold text-text-muted mb-4 capitalize">
                {current.weather[0].description}
              </span>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-text-secondary font-bold">
                <Thermometer size={18} className="text-red-400" />
                <span>H: {Math.round(current.main.temp_max)}°</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary font-bold">
                <Thermometer size={18} className="text-blue-400" />
                <span>L: {Math.round(current.main.temp_min)}°</span>
              </div>
            </div>
          </div>

          <div className="relative shrink-0 flex flex-col items-center">
            <div className="relative">
              {getWeatherIcon(
                current.weather[0].id,
                180,
                "drop-shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-pulse",
              )}
            </div>
            <button
              onClick={handleAlertClick}
              className="mt-8 px-8 py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 border border-slate-700 hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] active:scale-95 text-white font-bold transition-all duration-300 flex items-center gap-2 group backdrop-blur-md shadow-lg"
            >
              <Plus
                size={18}
                className="group-hover:rotate-90 transition-transform"
              />
              Add Climatic Alert
            </button>
          </div>
        </div>
      </motion.section>

      {/* Details Grid (Now below Hero) */}
      <motion.section
        variants={item}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {[
          {
            label: "Humidity",
            value: `${current.main.humidity}%`,
            icon: Droplets,
            color: "text-blue-400",
          },
          {
            label: "Wind Speed",
            value: `${current.wind.speed} km/h`,
            icon: Wind,
            color: "text-accent",
          },
          {
            label: "Visibility",
            value: `${current.visibility / 1000} km`,
            icon: Eye,
            color: "text-purple-400",
          },
          {
            label: "Pressure",
            value: `${current.main.pressure} hPa`,
            icon: Navigation,
            color: "text-red-400",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass-card p-6 flex flex-col gap-4 group hover:border-accent/30 transition-all"
          >
            <div
              className={`w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}
            >
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-text-primary">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </motion.section>

      {/* Hourly Forecast */}
      <motion.section variants={item} className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black text-xs uppercase tracking-widest text-text-muted flex items-center gap-2">
            <Clock size={14} className="text-accent" /> Next 24 Hours
          </h3>
        </div>
        <div className="glass-card p-6 flex gap-6 overflow-x-auto no-scrollbar scroll-smooth">
          {hourly.map((h, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 min-w-28 p-4 rounded-3xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-transparent dark:hover:border-white/10 hover:-translate-y-1 group"
            >
              <span className="text-sm font-bold text-text-secondary">
                {i === 0 ? "Now" : formatTime(h.dt)}
              </span>
              {getWeatherIcon(
                h.weather[0].id,
                32,
                "group-hover:scale-110 transition-transform",
              )}
              <span className="text-xs text-center font-medium text-text-muted capitalize h-8 flex items-center justify-center leading-tight">
                {h.weather[0].description}
              </span>
              <span className="text-2xl font-black text-text-primary">
                {Math.round(h.main.temp)}°
              </span>
              <div className="flex items-center gap-1 text-[10px] text-text-muted mt-1">
                <Droplets size={10} className="text-blue-400" />
                <span>{h.main.humidity}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 5-Day Forecast */}
      <motion.section variants={item} className="space-y-4">
        <h3 className="px-2 font-black text-xs uppercase tracking-widest text-text-muted flex items-center gap-2">
          <Sun size={14} className="text-accent" /> 5-Day Outlook
        </h3>
        <div className="space-y-4">
          {forecast.slice(0, 5).map((f, i) => (
            <div
              key={i}
              className="glass-card p-4 hover:border-accent/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-12 text-sm font-bold text-text-primary">
                    {i === 0
                      ? "Today"
                      : new Date(f.dt * 1000).toLocaleDateString(undefined, {
                          weekday: "short",
                        })}
                  </span>
                  {getWeatherIcon(f.weather[0].id, 24)}
                  <span className="text-xs font-medium text-text-muted">
                    {f.weather[0].description}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-black">
                  <span className="text-red-500">
                    {Math.round(f.main.temp_max)}°
                  </span>
                  <span className="text-blue-500 opacity-80">
                    {Math.round(f.main.temp_min)}°
                  </span>
                </div>
              </div>

              {/* Detailed Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/5">
                <div className="flex flex-col items-center gap-1">
                  <Wind size={12} className="text-accent" />
                  <span className="text-[10px] font-bold text-text-secondary">
                    {Math.round(f.wind.speed)} km/h
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Droplets size={12} className="text-blue-400" />
                  <span className="text-[10px] font-bold text-text-secondary">
                    {f.main.humidity}%
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Eye size={12} className="text-purple-400" />
                  <span className="text-[10px] font-bold text-text-secondary">
                    {(f.visibility ? f.visibility / 1000 : 10).toFixed(1)} km
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Navigation size={12} className="text-red-400" />
                  <span className="text-[10px] font-bold text-text-secondary">
                    {f.main.pressure} hPa
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
