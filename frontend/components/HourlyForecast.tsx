import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";
import { formatTemp } from "@/services/utils";
import WeatherIcon from "./WeatherIcon";

export default function HourlyForecast() {
  const { hourly, units } = useWeatherStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (hourly.length === 0) return null;

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px tolerance
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [hourly]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative group"
    >
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Forecast Timeline
      </h3>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-10 hidden md:block">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`p-2 rounded-full bg-white/50 dark:bg-black/30 backdrop-blur-md border border-white/40 dark:border-white/10 text-slate-700 dark:text-white shadow-lg transition-all ${
            canScrollLeft
              ? "hover:bg-white/80 dark:hover:bg-white/20 hover:scale-110 active:scale-95"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-10 hidden md:block">
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`p-2 rounded-full bg-white/50 dark:bg-black/30 backdrop-blur-md border border-white/40 dark:border-white/10 text-slate-700 dark:text-white shadow-lg transition-all ${
            canScrollRight
              ? "hover:bg-white/80 dark:hover:bg-white/20 hover:scale-110 active:scale-95"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-3 overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-none scroll-smooth"
      >
        {hourly.map((item, idx) => {
          const date = new Date(item.dt * 1000);
          const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric" });
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`glass-card flex flex-col items-center gap-2 px-5 py-4 min-w-24 shrink-0 transition-colors ${
                idx === 0
                  ? "bg-white/20 border-accent/50 ring-2 ring-accent/30 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  : "hover:bg-white/5"
              }`}
            >
              <span
                className={`text-xs font-medium whitespace-nowrap ${idx === 0 ? "text-white font-bold" : "text-text-muted"}`}
              >
                {idx === 0 ? "Now" : timeStr}
              </span>
              <div className="text-2xl drop-shadow-sm">
                <WeatherIcon code={item.weather[0].icon} size={32} />
              </div>
              <span className="text-sm font-bold text-text-primary">
                {formatTemp(item.main.temp, units)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
