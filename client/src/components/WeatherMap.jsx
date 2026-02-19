import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for leaflet marker icons in React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const WeatherMap = ({ lat, lon, cityName }) => {
  const position = [lat, lon];

  return (
    <section className="map-section visible-block">
      <h3>Interactive Weather Map</h3>
      <div className="map-wrapper">
        <MapContainer
          center={position}
          zoom={10}
          scrollWheelZoom={false}
          style={{ height: "400px", width: "100%", borderRadius: "15px" }}
        >
          <ChangeView center={position} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              {cityName} <br /> Current Location.
            </Popup>
          </Marker>
          {/* OpenWeatherMap Overlays */}
          <TileLayer
            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=d3c132ff743116450217c8cd03aba613`}
            opacity={0.4}
          />
        </MapContainer>
      </div>
    </section>
  );
};

export default WeatherMap;
