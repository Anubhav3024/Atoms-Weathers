"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useWeatherStore } from "@/store/weatherStore";
import { fetchWeatherByCoords, fetchForecastByCoords } from "@/services/api";
import { processForecast, interpolateHourlyData } from "@/services/utils";
import { Loader2, MapPin, Navigation } from "lucide-react";

export default function WeatherMap() {
  const {
    current,
    units,
    setWeather,
    setCity,
    addToHistory,
    setLoading,
    setError,
  } = useWeatherStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [hoverCoords, setHoverCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  /*
   * Selection Mode State
   * - false: Pan/Zoom only (default)
   * - true: Click to fetch weather
   */
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      // Dynamic import for Leaflet (Next.js requirement)
      const L = (await import("leaflet")).default;

      // Clean up previous map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default view if no current weather
      const initialLat = current?.coord.lat || 51.505;
      const initialLon = current?.coord.lon || -0.09;
      const initialZoom = current ? 10 : 2;

      const map = L.map(mapRef.current!, {
        scrollWheelZoom: true,
        zoomControl: false,
        attributionControl: false,
        minZoom: 2, // Prevent "4 to 5 maps" / world copy jump issues by restricting out-zoom
        maxZoom: 18, // Allow zooming into town level (standard max for tiles)
        maxBounds: [
          [-90, -180],
          [90, 180],
        ], // Restrict to one world view
        maxBoundsViscosity: 1.0, // Sticky bounds
      }).setView([initialLat, initialLon], initialZoom);

      // Add Zoom Control to top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Base tile layer - detect theme
      const isDark = document.documentElement.classList.contains("dark");

      // High-quality dark/light tiles (CartoDB)
      const tileUrl = isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

      L.tileLayer(tileUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      /*
       * Removed OWM Tile Layers (Temperature/Precipitation)
       * because they require a paid/valid API key and the hardcoded one was likely invalid,
       * causing 401 errors and visual clutter.
       * The base map (CartoDB) is sufficient and looks cleaner.
       */

      // Current Location Marker
      if (current) {
        const icon = L.divIcon({
          html: `<div style="
            background: ${isDark ? "#818cf8" : "#6366f1"};
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            border: 0.1875rem solid white;
            box-shadow: 0 0 0.9375rem rgba(99,102,241,0.6);
            animation: pulse 2s infinite;
          "></div>`,
          iconSize: [16, 16],
          className: "custom-marker",
        });

        L.marker([current.coord.lat, current.coord.lon], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: sans-serif; text-align: center;">
               <strong style="font-size: 0.875rem;">${current.name}</strong><br/>
               <span style="font-size: 1rem;">${Math.round(current.main.temp)}°</span>
             </div>`,
          );
      }

      // Click Handler
      map.on("click", async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        // Show loading state on map
        setIsMapLoading(true);
        setLoading(true);

        try {
          // Fetch weather for clicked coordinates
          const [weatherRes, forecastRes] = await Promise.all([
            fetchWeatherByCoords(lat, lng, units),
            fetchForecastByCoords(lat, lng, units),
          ]);

          const forecastList = forecastRes.data.list;
          const weatherData = weatherRes.data;

          // Update Store
          setWeather(
            weatherData,
            processForecast(forecastList),
            interpolateHourlyData(forecastList),
          );
          // Wait, I need to check how it was before.
          // It was: processForecast(forecastList), forecastList.slice(0, 8)
          // But I updated SearchBar to use interpolateHourlyData.
          // I should probably use interpolateHourlyData here too for consistency!
        } catch (err: any) {
          console.error("Map click fetch error:", err);
          setError("Could not fetch weather for this location.");
        } finally {
          setIsMapLoading(false);
          setLoading(false);
        }
      });

      // Hover Handler
      map.on("mousemove", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setHoverCoords({ lat, lng });
      });

      map.on("mouseout", () => {
        setHoverCoords(null);
      });

      mapInstanceRef.current = map;
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [current, units]); // Re-run when current weather or units change

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col h-full w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <MapPin size={18} className="text-accent" />
          Interactive Map
        </h3>
        <span className="text-xs text-text-muted bg-bg-card px-2 py-1 rounded-full border border-border">
          {isSelectionMode
            ? "Click location to fetch weather"
            : "Pan/Zoom mode"}
        </span>
      </div>

      <div className="relative flex-1 w-full min-h-125 rounded-3xl overflow-hidden glass-card shadow-lg border border-white/10">
        <div
          ref={mapRef}
          className={`absolute inset-0 z-0 ${isSelectionMode ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"}`}
        />

        {/* Selection Mode Toggle Button */}
        <div className="absolute top-4 left-4 z-[400]">
          <button
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            className={`p-3 rounded-xl shadow-lg border backdrop-blur-md transition-all flex items-center gap-2 ${
              isSelectionMode
                ? "bg-accent text-white border-accent shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-105"
                : "bg-white/90 dark:bg-slate-800/90 text-text-muted border-white/20 hover:text-text-primary"
            }`}
            title={
              isSelectionMode
                ? "Disable Selection Mode"
                : "Enable Location Picker"
            }
          >
            <MapPin
              size={20}
              className={isSelectionMode ? "animate-bounce" : ""}
            />
            <span
              className={`text-xs font-bold ${isSelectionMode ? "block" : "hidden md:block"}`}
            >
              {isSelectionMode ? "Pick Location" : "Move Map"}
            </span>
          </button>
        </div>

        {/* Hover Card */}
        {hoverCoords && !isMapLoading && (
          <div className="absolute top-4 right-16 z-[400] bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/20 pointer-events-none transition-all">
            <p className="text-xs font-bold text-text-primary mb-1">
              Cursor Location
            </p>
            <div className="flex flex-col gap-0.5 text-[10px] text-text-secondary font-mono">
              <span>Lat: {hoverCoords.lat.toFixed(4)}</span>
              <span>Lon: {hoverCoords.lng.toFixed(4)}</span>
            </div>
            {isSelectionMode && (
              <p className="text-[10px] text-accent mt-2 font-medium animate-pulse">
                Click to fetch
              </p>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {isMapLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white/90 dark:bg-slate-800/90 p-4 rounded-2xl shadow-xl flex items-center gap-3">
              <Loader2 className="animate-spin text-accent" size={24} />
              <span className="font-medium text-text-primary">
                Exploring...
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
