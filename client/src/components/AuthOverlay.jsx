import React, { useState } from "react";
import axios from "axios";

const AuthOverlay = ({ onLogin, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const endpoint = isRegister ? "/api/register" : "/api/login";
      const res = await axios.post(
        `http://localhost:5000${endpoint}`,
        formData,
      );
      localStorage.setItem("weatherToken", res.data.token);
      localStorage.setItem("weatherUser", JSON.stringify(res.data.user));
      onLogin(res.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay active">
      <div className="auth-card">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{isRegister ? "Join WeatherSky" : "Welcome Back"}</h2>
        <p>
          {isRegister
            ? "Create an account to save locations"
            : "Login to access your favorites"}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : isRegister ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="toggle-auth">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthOverlay;
