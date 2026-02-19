import React from "react";
import { getBootstrapIconClass } from "../utils/weatherUtils";

const TreeSVG = () => (
  <svg viewBox="0 0 64 64" fill="#1F5A3E">
    <path d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406 C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z" />
  </svg>
);

const LandscapeCard = ({ day }) => {
  const dateObj = new Date(day.dt * 1000);
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = dateObj.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="landscape-card">
      <section className="landscape-section">
        <div className="sky-landscape"></div>
        <div className="sun-landscape"></div>
        <div className="moon-landscape">
          <div className="shine-1"></div>
          <div className="shine-2"></div>
          <div className="real-moon">
            <div className="moon-shape"></div>
          </div>
        </div>
        <div className="hill-1"></div>
        <div className="hill-2"></div>
        <div className="ocean-landscape"></div>
        <div className="hill-3"></div>
        <div className="hill-4"></div>
        <div className="tree tree-1">
          <TreeSVG />
        </div>
        <div className="tree tree-2" style={{ left: "25%", bottom: "12%" }}>
          <TreeSVG />
        </div>
        <div className="tree tree-3">
          <TreeSVG />
        </div>
      </section>
      <section className="content-section-landscape">
        <div className="weather-main-info">
          <div>
            <h4>{dayName}</h4>
            <p>{dateStr}</p>
            <p
              style={{
                color: "var(--primary)",
                fontWeight: 600,
                fontSize: "0.8rem",
                marginTop: "4px",
              }}
            >
              {day.weather[0].main}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <i
              className={`bi ${getBootstrapIconClass(day.weather[0].icon)}`}
              style={{
                fontSize: "1.5rem",
                color: "var(--primary)",
                marginBottom: "5px",
              }}
            ></i>
            <span className="temp-landscape">{Math.round(day.main.temp)}°</span>
          </div>
        </div>
        <div className="metrics-landscape">
          <div className="metric-small">
            <span className="label">Hum.</span>
            <span className="val">{day.main.humidity}%</span>
          </div>
          <div className="metric-small">
            <span className="label">Wind</span>
            <span className="val">{Math.round(day.wind.speed * 3.6)}k/h</span>
          </div>
          <div className="metric-small">
            <span className="label">Press.</span>
            <span className="val">{day.main.pressure}hPa</span>
          </div>
        </div>
      </section>
    </div>
  );
};

const ForecastSection = ({ forecast }) => {
  return (
    <section className="forecast-section visible-block">
      <h3>5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((day, idx) => (
          <LandscapeCard key={idx} day={day} />
        ))}
      </div>
    </section>
  );
};

export default ForecastSection;
