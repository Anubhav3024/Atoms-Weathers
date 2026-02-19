"use client";
import React from "react";
import styles from "./FancySwitch.module.css";
import { useWeatherStore } from "@/store/weatherStore";

export default function FancySwitch() {
  const { theme, setTheme } = useWeatherStore();
  const isDark = theme === "dark";

  const toggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  return (
    <label className={styles.switch}>
      <input type="checkbox" checked={isDark} onChange={toggle} />
      <div className={styles.slider}>
        <div className={styles.sunMoon}>
          <svg
            className={styles.moonDot}
            style={{ left: 10, top: 3, width: 6, height: 6 }}
            viewBox="0 0 100 100"
          >
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg
            className={styles.moonDot}
            style={{ left: 2, top: 10, width: 10, height: 10 }}
            viewBox="0 0 100 100"
          >
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg
            className={styles.moonDot}
            style={{ left: 16, top: 18, width: 3, height: 3 }}
            viewBox="0 0 100 100"
          >
            <circle cx={50} cy={50} r={50} />
          </svg>

          <svg
            className={styles.lightRay}
            style={{ left: -8, top: -8, width: 43, height: 43 }}
            viewBox="0 0 100 100"
          >
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg
            className={styles.lightRay}
            style={{ left: "-50%", top: "-50%", width: 55, height: 55 }}
            viewBox="0 0 100 100"
          >
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg
            className={styles.lightRay}
            style={{ left: -18, top: -18, width: 60, height: 60 }}
            viewBox="0 0 100 100"
          >
            <circle cx={50} cy={50} r={50} />
          </svg>

          <svg
            className={styles.cloudDark}
            style={{ left: 30, top: 15, width: 40 }}
            viewBox="0 0 100 100"
          >
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg
            className={styles.cloudDark}
            style={{ left: 44, top: 10, width: 20 }}
            viewBox="0 0 100 100"
          >
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg
            className={styles.cloudDark}
            style={{ left: 18, top: 24, width: 30 }}
            viewBox="0 0 100 100"
          >
            <circle cx={50} cy={50} r={50} />
          </svg>

          <svg
            className={styles.cloudLight}
            style={{ left: 36, top: 18, width: 40 }}
            viewBox="0 0 100 100"
          >
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg
            className={styles.cloudLight}
            style={{ left: 48, top: 14, width: 20 }}
            viewBox="0 0 100 100"
          >
            <circle cx={50} cy={50} r={50} />
          </svg>
          <svg
            className={styles.cloudLight}
            style={{ left: 22, top: 26, width: 30 }}
            viewBox="0 0 100 100"
          >
            <circle cx={50} cy={50} r={50} />
          </svg>
        </div>

        <div className={styles.stars}>
          <svg
            className={styles.star}
            style={{ width: 20, top: 2, left: 3, animationDelay: "0.3s" }}
            viewBox="0 0 20 20"
          >
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg
            className={styles.star}
            style={{ width: 6, top: 16, left: 3 }}
            viewBox="0 0 20 20"
          >
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg
            className={styles.star}
            style={{ width: 12, top: 20, left: 10, animationDelay: "0.6s" }}
            viewBox="0 0 20 20"
          >
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg
            className={styles.star}
            style={{ width: 18, top: 0, left: 18, animationDelay: "1.3s" }}
            viewBox="0 0 20 20"
          >
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
        </div>
      </div>
    </label>
  );
}
