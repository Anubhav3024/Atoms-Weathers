"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserCircle, AlertTriangle } from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import WeatherMap from "@/components/WeatherMap";
import AlertsPanel from "@/components/AlertsPanel";
import SettingsPanel from "@/components/SettingsPanel";
import ProfilePanel from "@/components/ProfilePanel";
import AuthModal from "@/components/AuthModal";
import { fetchWeather, fetchForecast } from "@/services/api";

function DashboardContent() {
  const {
    activePage,
    user,
    error,
    setUser,
    setWeather,
    setLoading,
    setError,
    city,
    setCity,
    addToHistory,
    sidebarOpen,
    setMobileMenuOpen,
  } = useWeatherStore();

  const searchParams = useSearchParams();
  const [showAuth, setShowAuth] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Handle ?action=login from Landing Page
  useEffect(() => {
    if (searchParams?.get("action") === "login" && !user) {
      setShowAuth(true);
    }
  }, [searchParams, user]);

  const handleSearch = useCallback(
    async (targetCity: string) => {
      if (!targetCity.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const [currentRes, forecastRes] = await Promise.all([
          fetchWeather(targetCity),
          fetchForecast(targetCity),
        ]);

        const hourly = forecastRes.data.list.slice(0, 8);
        const forecast = forecastRes.data.list.filter(
          (_: unknown, i: number) => i % 8 === 0,
        );

        setWeather(currentRes.data, forecast, hourly);
        setCity(currentRes.data.name);
        addToHistory(currentRes.data.name);
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "City not found. Please try again.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setWeather, setCity, addToHistory],
  );

  // Initial data hydration & Default City
  useEffect(() => {
    const savedToken = localStorage.getItem("ws-token");
    const savedUser = localStorage.getItem("ws-user");

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser), savedToken);
      } catch {
        localStorage.removeItem("ws-token");
        localStorage.removeItem("ws-user");
      }
    }

    if (!city) handleSearch("New York");
  }, [city, setUser, handleSearch]);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "map":
        return <WeatherMap />;
      case "alerts":
        return <AlertsPanel />;
      case "settings":
        return <SettingsPanel />;
      case "profile":
        return <ProfilePanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-main transition-all duration-300">
      <Sidebar />

      <main
        className={`transition-all duration-300 px-6 py-4 lg:px-10 lg:py-6 ${
          sidebarOpen ? "md:ml-[16.25rem]" : "md:ml-20"
        } ml-0`}
      >
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-3 rounded-2xl bg-bg-card border border-border text-text-primary hover:bg-accent/10 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div className="relative group w-full max-w-4xl">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for a city..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(searchInput)
                }
                className="w-full pl-14 pr-6 py-4 rounded-3xl bg-bg-card border border-border text-text-primary outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent/40 shadow-xl shadow-black/5 transition-all"
                suppressHydrationWarning
              />
            </div>
          </div>

          <div className="flex items-center gap-4 self-end md:self-auto">
            {user ? (
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-bg-card border border-border shadow-lg">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-accent uppercase tracking-tighter">
                    Connected
                  </span>
                  <span className="text-sm font-bold text-text-primary">
                    {user.username}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent ring-2 ring-accent/20">
                  <UserCircle size={22} />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-8 py-4 rounded-3xl bg-accent text-white font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/30"
                suppressHydrationWarning
              >
                SIGN IN
              </button>
            )}
          </div>
        </header>

        {/* Error / Loading Banners */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-5 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex items-center gap-4 shadow-lg"
            >
              <AlertTriangle size={20} />
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-auto px-4 py-2 hover:bg-red-500/10 rounded-xl transition-all"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage + city}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
