import React from "react";

const SettingsPanel = ({ units, setUnits, onClose }) => {
  return (
    <div className="settings-overlay active">
      <div className="settings-card">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Settings</h2>
        <p>Customize your weather experience</p>

        <div className="settings-group">
          <label>Temperature Units</label>
          <div className="unit-toggle">
            <button
              className={units === "metric" ? "active" : ""}
              onClick={() => setUnits("metric")}
            >
              Celsius (°C)
            </button>
            <button
              className={units === "imperial" ? "active" : ""}
              onClick={() => setUnits("imperial")}
            >
              Fahrenheit (°F)
            </button>
          </div>
        </div>

        <div className="settings-group">
          <label>Notifications</label>
          <div className="toggle-row">
            <span>Daily Forecast Alerts</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="toggle-row">
            <span>Severe Weather Warnings</span>
            <input type="checkbox" defaultChecked />
          </div>
        </div>

        <button className="save-btn" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
