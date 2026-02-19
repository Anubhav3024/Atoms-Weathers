export const getBootstrapIconClass = (owmCode) => {
  const mapping = {
    "01d": "bi-brightness-high-fill",
    "01n": "bi-moon-stars-fill",
    "02d": "bi-cloud-sun",
    "02n": "bi-cloud-moon-fill",
    "03d": "bi-cloudy",
    "03n": "bi-cloudy",
    "04d": "bi-cloud-haze2",
    "04n": "bi-cloud-haze2",
    "09d": "bi-cloud-rain",
    "09n": "bi-cloud-rain",
    "10d": "bi-cloud-lightning-rain-fill",
    "10n": "bi-cloud-lightning-rain-fill",
    "11d": "bi-tsunami",
    "11n": "bi-tsunami",
    "13d": "bi-snow",
    "13n": "bi-snow",
    "50d": "bi-cloud-haze",
    "50n": "bi-cloud-haze",
  };
  return mapping[owmCode] || "bi-brightness-high-fill";
};

export const processForecast = (list) => {
  const daily = [];
  const seenDates = new Set();
  for (const item of list) {
    const date = item.dt_txt.split(" ")[0];
    const time = item.dt_txt.split(" ")[1];
    if (!seenDates.has(date) && time === "12:00:00") {
      daily.push(item);
      seenDates.add(date);
    }
  }
  if (daily.length < 5) {
    const fallback = [];
    const fallbackDates = new Set();
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
