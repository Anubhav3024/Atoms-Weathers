# Atoms Weather - Enterprise-Grade Weather Intelligence Platform

![Project Banner](https://via.placeholder.com/1200x400.png?text=Atoms+Weather+Dashboard)

> **A streamlined full-stack weather intelligence application engineered with Next.js 16, Node.js, and MongoDB.**

---

## 🚀 Project Overview

**Atoms Weather** is a sophisticated weather dashboard designed to provide hyper-local weather data with accurate forecasts and real-time visualization. It focuses on **user-centric personalization**, allowing users to save locations, set custom climatic alerts, and visualize data through interactive maps.

## 🏗️ Project Structure

The project is organized as a clean, high-performance full-stack application:

- `/backend`: Node.js & Express API server with MongoDB integration.
- `/frontend`: Premium Next.js frontend application (The Dashboard).

---

## 🌟 Key Technical Highlights

- **Next.js 16 App Router**: Modern React Server Components for optimal performance.
- **State Management**: Zustand for lightweight, atomic state management.
- **Auth System**: Custom JWT-based authentication with Bcrypt hashing.
- **Glassmorphism UI**: Professional, clean interface with a refined Blue & Gray color palette.

---

## 💻 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB URI
- OpenWeatherMap API Key

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Anubhav3024/Atoms-Weathers.git
    cd Atoms-Weathers
    ```

2.  **Backend Setup**

    ```bash
    cd backend
    npm install
    # Create .env with MONGODB_URI, JWT_SECRET, and OPENWEATHER_API_KEY
    npm run dev
    ```

3.  **Frontend Setup**

    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

4.  **Access the App**
    Open `http://localhost:3000` to view the dashboard.

---

## 🌐 Deployment

The application is fully prepared for cloud deployment:

- **Backend**: Deployed on [Render](https://render.com/).
- **Frontend**: Deployed on [Vercel](https://vercel.com/).
- **Database**: Hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

---

> Built with ❤️ by Anubhav Singh.
