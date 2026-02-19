import type { ForecastItem } from "@/store/weatherStore";

export const iconMap: Record<string, string> = {
  "01d": "☀️",
  "01n": "🌙",
  "02d": "⛅",
  "02n": "☁️",
  "03d": "☁️",
  "03n": "☁️",
  "04d": "☁️",
  "04n": "☁️",
  "09d": "🌧️",
  "09n": "🌧️",
  "10d": "🌦️",
  "10n": "🌧️",
  "11d": "⛈️",
  "11n": "⛈️",
  "13d": "🌨️",
  "13n": "🌨️",
  "50d": "🌫️",
  "50n": "🌫️",
};

export const getWeatherEmoji = (iconCode: string) => iconMap[iconCode] || "🌤️";

export const formatTemp = (temp: number, units: string) =>
  `${Math.round(temp)}°${units === "metric" ? "C" : "F"}`;

export const formatDate = (dt: number) =>
  new Date(dt * 1000).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export const formatTime = (dt: number) =>
  new Date(dt * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

export const getWindDirection = (deg: number) => {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
};

export const processForecast = (list: ForecastItem[]): ForecastItem[] => {
  const daily: ForecastItem[] = [];
  const seen = new Set<string>();
  for (const item of list) {
    const date = item.dt_txt.split(" ")[0];
    const time = item.dt_txt.split(" ")[1];
    if (!seen.has(date) && time === "12:00:00") {
      daily.push(item);
      seen.add(date);
    }
  }
  if (daily.length < 5) {
    const fallback: ForecastItem[] = [];
    const fallbackDates = new Set<string>();
    for (const item of list) {
      const date = item.dt_txt.split(" ")[0];
      if (!fallbackDates.has(date)) {
        fallback.push(item);
        fallbackDates.add(date);
      }
    }
    return fallback.slice(0, 5);
  }
  return daily;
};

export const getBgGradient = (weatherMain: string) => {
  const main = weatherMain.toLowerCase();
  if (main.includes("clear"))
    return "from-blue-200 via-sky-100 to-white dark:from-indigo-900 dark:via-slate-900 dark:to-slate-950";
  if (main.includes("cloud"))
    return "from-slate-200 via-gray-100 to-white dark:from-slate-800 dark:via-slate-900 dark:to-gray-950";
  if (main.includes("rain") || main.includes("drizzle"))
    return "from-blue-200 via-slate-200 to-gray-100 dark:from-slate-900 dark:via-blue-950 dark:to-slate-950";
  if (main.includes("snow"))
    return "from-sky-100 via-gray-100 to-white dark:from-slate-700 dark:via-indigo-900 dark:to-slate-950";
  if (main.includes("thunder"))
    return "from-slate-300 via-gray-200 to-slate-100 dark:from-black dark:via-slate-950 dark:to-indigo-950";
  return "from-blue-200 via-indigo-100 to-white dark:from-indigo-950 dark:via-slate-900 dark:to-slate-950";
};

export const interpolateHourlyData = (list: ForecastItem[]): ForecastItem[] => {
  const hourly: ForecastItem[] = [];
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const oneHour = 3600;

  for (let i = 0; i < 24; i++) {
    const targetTime = now + i * oneHour;

    // Find the two surrounding forecast items
    // We sort just in case, though API usually sends sorted data
    const sortedList = list.sort((a, b) => a.dt - b.dt);

    // Find the first item that is after the target time
    const nextIndex = sortedList.findIndex((item) => item.dt > targetTime);

    let item: ForecastItem;

    if (nextIndex === -1) {
      // If target is after all items, use the last one
      item = { ...sortedList[sortedList.length - 1], dt: targetTime };
    } else if (nextIndex === 0) {
      // If target is before all items, use the first one
      item = { ...sortedList[0], dt: targetTime };
    } else {
      // Interpolate between prev and next
      const prev = sortedList[nextIndex - 1];
      const next = sortedList[nextIndex];
      const totalDiff = next.dt - prev.dt;
      const currentDiff = targetTime - prev.dt;
      const ratio = currentDiff / totalDiff;

      item = {
        dt: targetTime,
        dt_txt: new Date(targetTime * 1000)
          .toISOString()
          .replace("T", " ")
          .substring(0, 19),
        main: {
          temp: prev.main.temp + (next.main.temp - prev.main.temp) * ratio,
          feels_like:
            prev.main.feels_like +
            (next.main.feels_like - prev.main.feels_like) * ratio,
          humidity: Math.round(
            prev.main.humidity +
              (next.main.humidity - prev.main.humidity) * ratio,
          ),
          pressure: Math.round(
            prev.main.pressure +
              (next.main.pressure - prev.main.pressure) * ratio,
          ),
          temp_min:
            prev.main.temp_min +
            (next.main.temp_min - prev.main.temp_min) * ratio,
          temp_max:
            prev.main.temp_max +
            (next.main.temp_max - prev.main.temp_max) * ratio,
        },
        weather: next.weather, // Use next weather state as it approaches
        wind: {
          speed: prev.wind.speed + (next.wind.speed - prev.wind.speed) * ratio,
          deg: Math.round(
            (prev.wind.deg || 0) +
              ((next.wind.deg || 0) - (prev.wind.deg || 0)) * ratio,
          ),
        },
        visibility: Math.round(
          (prev.visibility || 10000) +
            ((next.visibility || 10000) - (prev.visibility || 10000)) * ratio,
        ),
        pop: (prev.pop || 0) + ((next.pop || 0) - (prev.pop || 0)) * ratio,
      };
    }
    hourly.push(item);
  }

  return hourly;
};
