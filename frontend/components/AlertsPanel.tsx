"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Trash2, CheckCircle, Clock, MapPin } from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";

export default function AlertsPanel() {
  const { alerts, removeAlert, dismissAlert } = useWeatherStore();
  const activeAlerts = alerts.filter(
    (a) => a.status === "triggered" || a.status === "pending",
  );
  const pastAlerts = alerts.filter((a) => a.status === "dismissed");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <Bell className="text-accent" /> Your Alerts
        </h2>
        <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
          {activeAlerts.length} Active
        </span>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {activeAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <Bell
                size={48}
                className="mx-auto text-text-muted opacity-20 mb-4"
              />
              <p className="text-text-secondary">No active alerts set.</p>
              <p className="text-text-muted text-sm mt-1">
                Add one from the dashboard weather card.
              </p>
            </motion.div>
          ) : (
            activeAlerts.map((alert) => (
              <motion.div
                key={alert._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`glass-card p-5 border-l-4 flex items-center justify-between gap-4 ${
                  alert.status === "triggered"
                    ? "border-l-red-500 bg-red-500/5"
                    : "border-l-accent"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-text-primary text-lg">
                      {alert.message}
                    </h3>
                    {alert.status === "triggered" && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white animate-pulse">
                        Triggered
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {alert.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(alert.targetTime).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {alert.status === "triggered" && (
                    <button
                      onClick={() => dismissAlert(alert._id!)}
                      className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                      title="Mark as Read"
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => removeAlert(alert._id!)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-colors"
                    title="Delete Alert"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {pastAlerts.length > 0 && (
        <div className="opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
            Past Alerts
          </h3>
          <div className="space-y-3">
            {pastAlerts.map((alert) => (
              <div
                key={alert._id}
                className="glass-card p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-text-primary font-medium">
                    {alert.message}
                  </p>
                  <p className="text-xs text-text-muted">
                    {alert.city} •{" "}
                    {new Date(alert.targetTime).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => removeAlert(alert._id!)}
                  className="text-text-muted hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
