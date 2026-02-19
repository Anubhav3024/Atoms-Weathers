"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, Trash2, Search } from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";

interface SearchHistoryProps {
  onClose: () => void;
  onSelect: (city: string) => void;
}

export default function SearchHistory({
  onClose,
  onSelect,
}: SearchHistoryProps) {
  const { searchHistory, removeFromHistory, clearHistory } = useWeatherStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-2xl glass-card shadow-2xl border border-white/20"
    >
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Clock size={16} className="text-accent" /> Recent Searches
        </h3>
        {searchHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
          >
            <Trash2 size={12} /> Clear All
          </button>
        )}
      </div>

      <div className="max-h-60 overflow-y-auto custom-scrollbar bg-black/20 backdrop-blur-md">
        {searchHistory.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">
            No recent searches.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {searchHistory.map((item) => (
              <li
                key={item.city + item.timestamp}
                className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors group"
              >
                <button
                  onClick={() => onSelect(item.city)}
                  className="flex-1 text-left flex items-center gap-3 text-sm text-text-primary"
                >
                  <Search size={14} className="text-text-muted opacity-50" />
                  <div>
                    <span className="font-medium">{item.city}</span>
                    <span className="text-xs text-text-muted block mt-0.5">
                      {new Date(item.timestamp).toLocaleDateString()} •{" "}
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromHistory(item.city);
                  }}
                  className="p-1.5 rounded-full hover:bg-red-500/20 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove from history"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
