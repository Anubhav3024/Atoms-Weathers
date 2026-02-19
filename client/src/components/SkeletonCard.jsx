import React from "react";

export const SkeletonCurrent = () => (
  <div className="current-card skeleton">
    <div
      className="weather-info skeleton-block"
      style={{ height: "150px", width: "100%", marginBottom: "20px" }}
    ></div>
    <div className="details-grid">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="detail-card skeleton-block"
          style={{ height: "100px" }}
        ></div>
      ))}
    </div>
  </div>
);

export const SkeletonForecast = () => (
  <div className="forecast-grid">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="landscape-card skeleton-block"
        style={{ height: "200px" }}
      ></div>
    ))}
  </div>
);
