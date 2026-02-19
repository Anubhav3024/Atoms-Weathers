import React from "react";
import { getBootstrapIconClass } from "../utils/weatherUtils";

const CurrentWeather = ({ data, isFavorite, onToggleFavorite }) => {
  const detailsData = [
    { label: "Feels Like", val: `${Math.round(data.main.feels_like)}°C` },
    { label: "Humidity", val: `${data.main.humidity}%` },
    { label: "Wind Speed", val: `${Math.round(data.wind.speed * 3.6)} km/h` },
    { label: "Pressure", val: `${data.main.pressure} hPa` },
  ];

  return (
    <section className="current-card visible">
      <div className="weather-info">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2>
            {data.name}, {data.sys.country}
          </h2>
          <button
            onClick={onToggleFavorite}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.8rem",
              color: isFavorite ? "#ffd700" : "var(--text-muted)",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.2)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <i className={`bi ${isFavorite ? "bi-star-fill" : "bi-star"}`}></i>
          </button>
        </div>
        <div className="date">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className="main-temp">
          <i
            className={`floating-icon bi ${getBootstrapIconClass(data.weather[0].icon)}`}
          ></i>
          <span>{Math.round(data.main.temp)}°</span>
        </div>
        <div className="weather-desc">{data.weather[0].description}</div>
      </div>
      <div className="details-grid">
        {detailsData.map((item, idx) => (
          <div key={idx} className="detail-card">
            <div className="notiglow"></div>
            <div className="notiborderglow"></div>
            <div className="notititle">{item.label}</div>
            <div className="notibody">{item.val}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CurrentWeather;
