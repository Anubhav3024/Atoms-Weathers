"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Bell } from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";

interface AlertModalProps {
  onClose: () => void;
}

export default function AlertModal({ onClose }: AlertModalProps) {
  const { city, addAlert } = useWeatherStore();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    const targetTime = new Date(`${date}T${time}`).getTime();
    if (isNaN(targetTime)) return;

    addAlert(city, targetTime, message || `Weather alert for ${city}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-card w-full max-w-md p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-text-primary mb-1 flex items-center gap-2">
          <Bell className="text-accent" size={24} />
          Set Alert
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          Get notified for weather conditions in{" "}
          <span className="font-semibold text-accent">{city}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-text-primary focus:ring-2 focus:ring-accent/50 outline-none"
              />
              <Calendar
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Time
            </label>
            <div className="relative">
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-text-primary focus:ring-2 focus:ring-accent/50 outline-none"
              />
              <Clock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Note (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g., Bring an umbrella..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent/50 outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-accent hover:bg-accent-light text-white font-medium rounded-xl shadow-lg shadow-accent/25 transition-all mt-2"
          >
            Create Alert
          </button>
        </form>
      </motion.div>
    </div>
  );
}
