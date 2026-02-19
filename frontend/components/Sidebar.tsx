"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CloudSun,
  Map as MapIcon,
  Bell,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
} from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    activePage,
    setActivePage,
    user,
    searchHistory,
    removeFromHistory,
    clearHistory,
    setCity,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useWeatherStore();

  // Force expand when mobile menu opens
  useEffect(() => {
    if (mobileMenuOpen && collapsed) {
      setCollapsed(false);
    }
  }, [mobileMenuOpen, collapsed]);

  const navItems: {
    id: "dashboard" | "map" | "alerts" | "settings";
    icon: React.ElementType;
    label: string;
  }[] = [
    { id: "dashboard", icon: CloudSun, label: "Dashboard" },
    { id: "map", icon: MapIcon, label: "Weather Map" },
    { id: "alerts", icon: Bell, label: "Alerts" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const handlePageChange = (
    page: "dashboard" | "map" | "alerts" | "settings" | "profile",
  ) => {
    setActivePage(page);
  };

  const handleCitySelect = (city: string) => {
    setCity(city);
    setActivePage("dashboard");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? "5rem" : "16.25rem" }}
        className={`fixed left-0 top-0 h-screen bg-bg-sidebar border-r border-border z-50 flex flex-col transition-all duration-300 shadow-2xl shadow-black/20
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="h-[5rem] flex items-center justify-center border-b border-border/50 relative">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
              <CloudSun size={24} strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col leading-none"
              >
                <span className="font-black text-lg tracking-tight text-slate-700">
                  ATOMS
                </span>
                <span className="text-[0.6rem] font-bold text-blue-600 uppercase tracking-widest">
                  WEATHER
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                className={`relative flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-accent/10 text-accent shadow-sm"
                      : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
                  }
                  ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon
                  size={22}
                  className={`shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {!collapsed && (
                  <span className="font-bold text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-2xl bg-accent/5 border border-accent/10 z-[-1]"
                  />
                )}
              </button>
            );
          })}

          <div className="my-4 h-px bg-border/50 mx-2" />

          {/* Search History / Favorites */}
          {!collapsed && (
            <div className="px-2">
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="text-[0.625rem] font-black text-text-muted uppercase tracking-wider">
                  Recent
                </span>
                {searchHistory.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-[0.625rem] text-text-muted hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={10} /> Clear
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1">
                {searchHistory.slice(0, 5).map((item) => (
                  <div
                    key={item.city + item.timestamp}
                    className="group flex items-center justify-between p-2 rounded-xl hover:bg-bg-card transition-colors cursor-pointer"
                    onClick={() => handleCitySelect(item.city)}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Clock
                        size={14}
                        className="text-text-muted group-hover:text-accent transition-colors shrink-0"
                      />
                      <span className="text-xs font-semibold text-text-secondary group-hover:text-text-primary truncate">
                        {item.city}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(item.city);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {searchHistory.length === 0 && (
                  <div className="text-center py-4 text-xs text-text-muted italic">
                    No recent searches
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/50 hidden md:flex flex-col gap-2">
          {!collapsed && user && (
            <button
              onClick={() => setActivePage("profile")}
              className="flex items-center gap-3 p-3 rounded-2xl bg-bg-card border border-border hover:border-accent/30 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <User size={16} />
              </div>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-xs font-bold text-text-primary truncate w-full text-left">
                  My Profile
                </span>
                <span className="text-[10px] text-text-muted truncate w-full text-left">
                  Manage Account
                </span>
              </div>
            </button>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-3 p-3 rounded-2xl text-text-muted hover:text-text-primary hover:bg-bg-card transition-all
              ${collapsed ? "justify-center" : ""}`}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            {!collapsed && (
              <span className="text-xs font-bold">Collapse Sidebar</span>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
