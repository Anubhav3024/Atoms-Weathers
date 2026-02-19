import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";
import LandscapeCard from "./LandscapeCard";

export default function ForecastCards() {
  const { forecast, units, city, theme } = useWeatherStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (forecast.length === 0) return null;

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [forecast]);

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
      transition={{ delay: 0.3 }}
      className="relative group"
    >
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        5-Day Forecast
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
        className="flex overflow-x-auto pb-6 pt-2 -mx-2 px-2 scrollbar-none scroll-smooth gap-4 items-stretch"
      >
        {forecast.map((day, idx) => {
          const dateObj = new Date(day.dt * 1000);
          const dayName = dateObj.toLocaleDateString("en-US", {
            weekday: "long",
          });
          const dateStr = dateObj.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          });

          const cardVariant = theme === "dark" ? "dark" : "light";

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              className="min-w-70 md:min-w-80 shrink-0"
            >
              <LandscapeCard
                variant={cardVariant}
                dayName={dayName}
                date={dateStr}
                temp={day.main.temp}
                condition={day.weather[0].main}
                iconCode={day.weather[0].icon}
                city={city.split(",")[0]}
                units={units}
                windSpeed={day.wind.speed}
                humidity={day.main.humidity}
                pressure={day.main.pressure}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
