"use client";
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  AlignJustify,
  Tornado,
} from "lucide-react";

interface WeatherIconProps {
  code: string;
  size?: number;
  className?: string;
}

export default function WeatherIcon({
  code,
  size = 24,
  className = "",
}: WeatherIconProps) {
  // Map OpenWeatherMap icon codes to Lucide icons
  // https://openweathermap.org/weather-conditions
  const iconMap: Record<string, React.ElementType> = {
    "01d": Sun, // clear sky day
    "01n": Moon, // clear sky night
    "02d": CloudSun, // few clouds day
    "02n": CloudMoon, // few clouds night
    "03d": Cloud, // scattered clouds
    "03n": Cloud,
    "04d": Cloud, // broken clouds
    "04n": Cloud,
    "09d": CloudDrizzle, // shower rain
    "09n": CloudDrizzle,
    "10d": CloudRain, // rain day
    "10n": CloudRain, // rain night
    "11d": CloudLightning, // thunderstorm
    "11n": CloudLightning,
    "13d": Snowflake, // snow
    "13n": Snowflake,
    "50d": AlignJustify, // mist
    "50n": AlignJustify,
  };

  const colorMap: Record<string, string> = {
    "01d": "text-amber-500", // Clear Day (Sun) -> Amber/Orange
    "01n": "text-indigo-400", // Clear Night (Moon) -> Indigo/Blue
    "02d": "text-amber-400", // Few Clouds Day -> Lighter Amber
    "02n": "text-indigo-300", // Few Clouds Night
    "03d": "text-slate-400", // Scattered Clouds -> Slate
    "03n": "text-slate-400",
    "04d": "text-slate-500", // Broken Clouds -> Darker Slate
    "04n": "text-slate-500",
    "09d": "text-blue-400", // Shower Rain -> Blue
    "09n": "text-blue-400",
    "10d": "text-blue-500", // Rain Day -> Richer Blue
    "10n": "text-blue-500",
    "11d": "text-purple-500", // Thunderstorm -> Purple
    "11n": "text-purple-500",
    "13d": "text-cyan-400", // Snow -> Cyan/Ice
    "13n": "text-cyan-400",
    "50d": "text-teal-400", // Mist -> Teal
    "50n": "text-teal-400",
  };

  const IconComponent = iconMap[code] || CloudSun;
  // If className has a text color specifically (e.g. text-white), don't override.
  // But usually we just want to append.
  // Actually, we want these colors to be the default if no color is provided.
  const defaultColorClass = colorMap[code] || "text-text-primary";

  // Combine classes. If className is provided, it takes precedence if it has specific overrides?
  // Tailwind doesn't auto-resolve conflicts, but last class wins usually.
  // Let's prepend the color class.
  const finalClass = `${defaultColorClass} ${className}`;

  return <IconComponent size={size} className={finalClass} />;
}
