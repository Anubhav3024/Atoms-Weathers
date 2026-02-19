"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CloudSun,
  ArrowRight,
  UserCircle,
  LayoutDashboard,
  LogOut,
  Bell,
  Map as MapIcon,
} from "lucide-react";

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("ws-token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-between p-6 relative overflow-hidden">
      {/* Background Ambience with Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/20 blur-[8rem] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[8rem] rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center space-y-10"
      >
        {/* Logo with Spin Animation */}
        <div className="flex items-center gap-4 mb-6 group cursor-default">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6 }}
            className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-blue-500 to-purple-600 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-blue-500/30 border border-white/10"
          >
            <CloudSun className="text-white w-10 h-10" strokeWidth={2.5} />
          </motion.div>
          <div className="flex flex-col items-start">
            <span className="font-black text-5xl text-slate-700 tracking-tighter leading-none">
              ATOMS
              <span className="text-blue-600">WEATHER</span>
            </span>
            <span className="text-xs font-bold text-slate-400 tracking-[0.3em] uppercase ml-1">
              Weather Intelligence
            </span>
          </div>
        </div>

        {/* Hero Text */}
        <div className="space-y-4 -mt-4">
          <h1 className="text-6xl md:text-8xl font-black text-slate-800 leading-[1] tracking-tight drop-shadow-sm">
            Forecasts <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400 animate-gradient-x bg-size-[200%_auto]">
              Reimagined.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Hyper-local weather data, interactive maps, and AI-driven insights.
            <br className="hidden md:block" /> Designed for those who need
            precision.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-10 py-5 rounded-full bg-accent text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/30 flex items-center justify-center gap-3 group"
            >
              <LayoutDashboard size={24} />
              Open Dashboard
              <ArrowRight
                size={24}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-10 py-5 rounded-full bg-accent text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/30 flex items-center justify-center gap-3 group"
              >
                Get Started
                <ArrowRight
                  size={24}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                href="/dashboard?action=login"
                className="w-full sm:w-auto px-10 py-5 rounded-full bg-white text-accent font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-3 border-2 border-transparent hover:border-accent/10"
              >
                <UserCircle size={24} />
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Feature Grid (Mini) */}
        {!isAuthenticated && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full text-left max-w-4xl">
            {[
              {
                title: "Real-time Precision",
                desc: "Live global data.",
                icon: CloudSun,
                color: "text-amber-400",
                bg: "bg-amber-400/10",
              },
              {
                title: "Smart Alerts",
                desc: "Instant severe weather notifications.",
                icon: Bell,
                color: "text-red-400",
                bg: "bg-red-400/10",
              },
              {
                title: "Global Mapping",
                desc: "Interactive weather visuals.",
                icon: MapIcon,
                color: "text-blue-400",
                bg: "bg-blue-400/10",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-[1.5rem] bg-white/5 border border-white/10 backdrop-blur-md group hover:bg-white/10 hover:border-accent/30 transition-all cursor-default"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                >
                  <item.icon
                    className={`${item.color} w-5 h-5`}
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="font-bold text-lg text-text-primary mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-snug opacity-80">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Footer - Relative positioning to avoid overlap */}
      <footer className="mt-12 mb-6 text-center text-sm text-text-muted font-medium opacity-60 hover:opacity-100 transition-opacity z-10">
        © 2026 Atoms Weather. Crafted with precision.
      </footer>
    </div>
  );
}
