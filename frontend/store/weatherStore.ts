import { create } from "zustand";
import {
  getUserData,
  toggleFavorite as apiToggleFavorite,
  addHistory as apiAddHistory,
  addAlert as apiAddAlert,
  removeAlert as apiRemoveAlert,
} from "@/services/api";

export interface WeatherData {
  name: string;
  coord: { lat: number; lon: number };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: { id: number; main: string; description: string; icon: string }[];
  wind: { speed: number; deg: number };
  sys: { country: string; sunrise: number; sunset: number };
  visibility: number;
  dt: number;
}

export interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: { id: number; main: string; description: string; icon: string }[];
  wind: { speed: number; deg: number };
  visibility: number;
  pop: number; // Probability of precipitation
}

export interface UserData {
  username: string;
  email: string;
  favorites: string[];
  preferences: { units: string; theme: string };
}

export interface SearchHistoryItem {
  _id?: string;
  city: string;
  timestamp: number;
}

export interface AlertItem {
  _id?: string;
  city: string;
  targetTime: number;
  message: string;
  status: "pending" | "triggered" | "dismissed";
  createdAt: number;
}

interface WeatherStore {
  // Weather data
  current: WeatherData | null;
  forecast: ForecastItem[];
  hourly: ForecastItem[];
  loading: boolean;
  error: string | null;
  city: string;

  // User
  user: UserData | null;
  token: string | null;

  // UI
  theme: "light" | "dark";
  units: "metric" | "imperial";
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  activePage: "dashboard" | "map" | "alerts" | "settings" | "profile";

  // Search History
  searchHistory: SearchHistoryItem[];

  // Alerts
  alerts: AlertItem[];

  // Actions
  setWeather: (
    current: WeatherData,
    forecast: ForecastItem[],
    hourly: ForecastItem[],
  ) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCity: (city: string) => void;
  setUser: (user: UserData | null, token: string | null) => void;
  syncData: () => Promise<void>;
  setTheme: (theme: "light" | "dark") => void;
  setUnits: (units: "metric" | "imperial") => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setActivePage: (page: WeatherStore["activePage"]) => void;
  toggleFavorite: (city: string) => void;
  logout: () => void;

  // Search History Actions
  addToHistory: (city: string) => void;
  removeFromHistory: (city: string) => void;
  clearHistory: () => void;

  // Alert Actions
  addAlert: (city: string, targetTime: number, message: string) => void;
  removeAlert: (id: string) => void;
  triggerAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  updateProfile: (data: { email?: string; password?: string }) => Promise<void>;
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  current: null,
  forecast: [],
  hourly: [],
  loading: false,
  error: null,
  city: "",

  user: null,
  token: null,

  theme: "light",
  units: "metric",
  sidebarOpen: true,
  mobileMenuOpen: false,
  activePage: "dashboard",

  setWeather: (current, forecast, hourly) =>
    set({ current, forecast, hourly, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCity: (city) => set({ city }),
  setUser: (user, token) => {
    set({ user, token });
    if (token) get().syncData();
  },
  syncData: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await getUserData();
      set({
        user: res.data,
        searchHistory: res.data.searchHistory || [],
        alerts: res.data.alerts || [],
      });
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.warn("Token expired during sync. Logging out.");
        get().logout();
      } else {
        console.error("Failed to sync data", err);
      }
    }
  },
  setTheme: (theme) => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("ws-theme", theme);
    set({ theme });
  },
  setUnits: (units) => {
    localStorage.setItem("ws-units", units);
    set({ units });
  },
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),

  setActivePage: (activePage) => set({ activePage }),
  toggleFavorite: async (city) => {
    const { user, token } = get();
    if (!token || !user) return;
    try {
      const res = await apiToggleFavorite(city);
      set({ user: { ...user, favorites: res.data } });
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  },
  logout: () => {
    localStorage.removeItem("ws-token");
    localStorage.removeItem("ws-user");
    set({ user: null, token: null, searchHistory: [], alerts: [] });
    window.location.href = "/";
  },

  searchHistory: [],
  alerts: [],

  addToHistory: async (city) => {
    const { token } = get();
    // Only attempt API call if we have a token
    if (token) {
      try {
        const res = await apiAddHistory(city);
        set({ searchHistory: res.data });
      } catch (err: any) {
        // If 401, it means token is invalid/expired
        if (err.response?.status === 401) {
          console.warn(
            "Token expired or invalid during history save. Logging out.",
          );
          get().logout(); // Logout to clear invalid token
        } else {
          console.error("Failed to add to history", err);
        }

        // Fallback to local history even if API fails
        set((state) => ({
          searchHistory: [
            { city, timestamp: Date.now() },
            ...state.searchHistory.filter((h) => h.city !== city),
          ].slice(0, 10),
        }));
      }
    } else {
      // Local only for visitors
      set((state) => ({
        searchHistory: [
          { city, timestamp: Date.now() },
          ...state.searchHistory.filter((h) => h.city !== city),
        ].slice(0, 10),
      }));
    }
  },

  removeFromHistory: (city) =>
    set((state) => ({
      searchHistory: state.searchHistory.filter((item) => item.city !== city),
    })),

  clearHistory: () => set({ searchHistory: [] }),

  addAlert: async (city, targetTime, message) => {
    const { token } = get();
    if (token) {
      try {
        const res = await apiAddAlert(city, targetTime, message);
        set({ alerts: res.data });
      } catch (err) {
        console.error("Failed to add alert", err);
      }
    }
  },

  removeAlert: async (id) => {
    const { token } = get();
    if (token) {
      try {
        const res = await apiRemoveAlert(id);
        set({ alerts: res.data });
      } catch (err) {
        console.error("Failed to remove alert", err);
      }
    }
  },

  triggerAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((item) =>
        item._id === id ? { ...item, status: "triggered" } : item,
      ),
    })),

  dismissAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((item) =>
        item._id === id ? { ...item, status: "dismissed" } : item,
      ),
    })),

  updateProfile: async (data) => {
    const { token, user } = get();
    if (token) {
      try {
        const mod = await import("@/services/api");
        const res = await mod.updateProfile(data);
        set({ user: { ...user, ...res.data } });
      } catch (err) {
        console.error("Failed to update profile", err);
        throw err;
      }
    }
  },
}));
