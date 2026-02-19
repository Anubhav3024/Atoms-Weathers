import axios from "axios";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:5000/api`;
  }
  return "http://localhost:5000/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
});

// Add Interceptor for Token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("ws-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Weather by city name
export const fetchWeather = (city: string, units = "metric") =>
  API.get(`/weather/current?city=${encodeURIComponent(city)}&units=${units}`);

export const fetchForecast = (city: string, units = "metric") =>
  API.get(`/weather/forecast?city=${encodeURIComponent(city)}&units=${units}`);

// Weather by coordinates (for map clicks)
export const fetchWeatherByCoords = (
  lat: number,
  lon: number,
  units = "metric",
) => API.get(`/weather/current?lat=${lat}&lon=${lon}&units=${units}`);

export const fetchForecastByCoords = (
  lat: number,
  lon: number,
  units = "metric",
) => API.get(`/weather/forecast?lat=${lat}&lon=${lon}&units=${units}`);

// Auth
export const loginUser = (email: string, password: string) =>
  API.post("/auth/login", { email, password });

export const registerUser = (
  username: string,
  email: string,
  password: string,
) => API.post("/auth/register", { username, email, password });

// User Data Persistence
export const getUserData = () => API.get("/user/data");

export const toggleFavorite = (city: string) =>
  API.post("/user/favorite", { city });

export const addHistory = (city: string) => API.post("/user/history", { city });

export const addAlert = (city: string, targetTime: number, message: string) =>
  API.post("/user/alert", { city, targetTime, message });

export const removeAlert = (id: string) => API.delete(`/user/alert/${id}`);

export const updateProfile = (data: { email?: string; password?: string }) =>
  API.put("/user/update", data);

export default API;
