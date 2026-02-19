import React from "react";
import { getBootstrapIconClass } from "../utils/weatherUtils";

const HourlyForecast = ({ hourlyData }) => {
  return (
    <section className="hourly-section visible-block">
      <h3>Hourly Forecast</h3>
      <div className="hourly-container">
        {hourlyData.map((hour, idx) => {
          const time = new Date(hour.dt * 1000).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          });
          const icon = `bi ${getBootstrapIconClass(hour.weather[0].icon)}`;
          return (
            <div key={idx} className="hourly-card">
              <span className="time">{time}</span>
              <i className={icon}></i>
              <span className="temp">{Math.round(hour.main.temp)}°</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HourlyForecast;
