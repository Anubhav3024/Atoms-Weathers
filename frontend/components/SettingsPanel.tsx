"use client";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";
import FancySwitch from "./FancySwitch";

export default function SettingsPanel() {
  const { units, setUnits } = useWeatherStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto space-y-6"
    >
      <h2 className="text-2xl font-bold text-text-primary">Settings</h2>

      {/* Theme (Fancy Switch) */}
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-text-primary text-lg">
            Appearance
          </h3>
          <p className="text-text-secondary text-sm">Toggle light/dark mode</p>
        </div>
        <FancySwitch />
      </div>

      {/* Units */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-text-primary mb-4">
          Temperature Units
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => setUnits("metric")}
            className={`flex-1 py-3 rounded-2xl font-medium text-sm transition-all cursor-pointer ${
              units === "metric"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "bg-border text-text-secondary hover:text-text-primary"
            }`}
          >
            °C Celsius
          </button>
          <button
            onClick={() => setUnits("imperial")}
            className={`flex-1 py-3 rounded-2xl font-medium text-sm transition-all cursor-pointer ${
              units === "imperial"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "bg-border text-text-secondary hover:text-text-primary"
            }`}
          >
            °F Fahrenheit
          </button>
        </div>
      </div>

      {/* Language */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe size={20} className="text-accent" />
          <h3 className="font-semibold text-text-primary">Language</h3>
        </div>
        <select
          className="w-full py-3 px-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-accent/40 transition-all cursor-pointer"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
          defaultValue="en"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
    </motion.div>
  );
}
