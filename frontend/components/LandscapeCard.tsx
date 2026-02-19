"use client";
import React from "react";
import styles from "./LandscapeCard.module.css";
import { formatTemp } from "@/services/utils";
import WeatherIcon from "./WeatherIcon";

interface LandscapeCardProps {
  variant: "light" | "dark";
  date: string;
  dayName: string;
  temp: number;
  condition: string;
  iconCode: string;
  units: "metric" | "imperial";
  windSpeed?: number;
  humidity?: number;
  pressure?: number;
  city?: string;
}

export default function LandscapeCard({
  variant,
  date,
  dayName,
  temp,
  condition,
  iconCode,
  units,
  windSpeed,
  humidity,
  pressure,
}: LandscapeCardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <section className={styles.landscapeSection}>
        <div className={styles.sky} />

        {variant === "light" ? (
          <div className={styles.sun} />
        ) : (
          <div className={styles.moon}>
            <div className={styles.shine1} />
            <div className={styles.shine2} />
            <div className={styles.realMoon}>
              <div className={styles.moonShape} />
            </div>
          </div>
        )}

        {/* Hills and Reflections preserved */}
        <div className={`${styles.hill} ${styles.hill1}`} />
        <div className={`${styles.hill} ${styles.hill2}`} />

        <div className={styles.ocean}>
          <div
            className={styles.reflection}
            style={{
              top: "5%",
              left: "32%",
              width: 40,
              height: 10,
              clipPath: "polygon(0% 0%, 100% 0%, 50% 20%)",
            }}
          />
          <div
            className={styles.reflection}
            style={{
              top: "15%",
              left: "39%",
              width: 80,
              height: 15,
              clipPath: "polygon(0% 0%, 100% 0%, 60% 20%, 40% 20%)",
            }}
          />
          <div
            className={styles.reflection}
            style={{
              top: "27%",
              right: "15%",
              width: 60,
              height: 2,
              clipPath:
                "polygon(0% 50%, 40% 0%, 60% 0%, 100% 50%, 60% 100%, 40% 100%)",
            }}
          />
        </div>

        <div className={`${styles.hill} ${styles.hill3}`} />
        <div className={`${styles.hill} ${styles.hill4}`} />

        <div
          className={styles.tree}
          style={{ bottom: "20%", left: "3%", width: 50 }}
        >
          <TreeSvg color={variant === "light" ? "#b77873" : "#47567F"} />
        </div>
        <div
          className={styles.tree}
          style={{ bottom: "14%", left: "25%", width: 50 }}
        >
          <TreeSvg color={variant === "light" ? "#b77873" : "#47567F"} />
        </div>
        <div
          className={styles.tree}
          style={{ bottom: "10%", right: "1%", width: 65 }}
        >
          <TreeSvg color={variant === "light" ? "#a16773" : "#4A4973"} />
        </div>

        <div className={styles.filter} />
      </section>

      <section className={styles.contentSection}>
        <div className={styles.cardHeader}>
          <div className={styles.headerLeft}>
            <h4 className={styles.day}>{dayName}</h4>
            <p className={styles.date}>{date}</p>
            <p className={styles.condition}>{condition}</p>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.weatherIcon}>
              <WeatherIcon code={iconCode} size={32} />
            </span>
            <p className={styles.bigTemp}>{formatTemp(temp, units)}</p>
          </div>
        </div>

        <div className={styles.separator} />

        <div className={styles.metricsGrid}>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Hum.</span>
            <span className={styles.metricValue}>{humidity}%</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Wind</span>
            <span className={styles.metricValue}>
              {Math.round(windSpeed || 0)} {units === "metric" ? "k/h" : "mph"}
            </span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Press.</span>
            <span className={styles.metricValue}>{pressure}hPa</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function TreeSvg({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" fill={color}>
      <path d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406 C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z" />
    </svg>
  );
}
