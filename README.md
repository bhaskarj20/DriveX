# 🚗 DriveX

### AI-Powered Driver Safety & Intelligent Driving Assistant

> **Monitor the driver. Understand the drive. Reduce the risk.**

DriveX is a smart driver-safety platform that combines **driver monitoring, vehicle telemetry, risk analysis, live location, emergency detection, and an AI Safety Copilot** into a single dashboard.

---

## ✨ What DriveX Does

DriveX continuously brings together information about the **driver, vehicle, and driving environment** to provide a clearer picture of driving safety.

### 🧑‍💻 Driver Monitoring

* 👁️ Face and driver-state monitoring
* 😴 Drowsiness detection
* 📱 Distraction detection
* 🧠 Driver states: **Alert · Distracted · Drowsy · Critical**
* ❤️ Heart-rate monitoring

### 🚘 Vehicle Monitoring

* ⚡ Vehicle speed
* 🌡️ Temperature
* 🔋 Battery status
* ❤️ Heart rate
* 🏎️ Driving events
* 📡 Live telemetry updates

### 🧠 Intelligent Risk Engine

DriveX converts multiple safety signals into a single **risk score from 0–10**.

The score considers factors such as:

```text
Driver State
     ↓
Heart Rate ──┐
             │
Vehicle Data ├──→ Risk Engine ──→ Risk Score
             │
Driving Event┘
     ↓
Safety Response
```

This allows DriveX to identify increasing risk instead of relying on a single sensor.

---

## 🚨 Emergency Detection

When dangerous conditions are detected, DriveX can trigger an emergency workflow.

* 🚨 Emergency alerts
* ⏱️ Safety confirmation countdown
* 📍 Current location
* 👥 Emergency contacts
* 📝 Emergency event history
* 🛡️ Simulated authority notification

The driver can confirm that they are safe before the emergency workflow continues.

---

## 🗺️ Live Location

DriveX provides a live map during an active drive session.

The dashboard can display:

* 📍 Current driver location
* 🗺️ Interactive map
* 🚗 Active driving session
* 📡 Location updates

---

## 🤖 AI Safety Copilot

DriveX includes an AI assistant designed specifically around driving safety.

Instead of acting as a generic chatbot, the Copilot can use the current DriveX context, including:

```text
Vehicle Status
Driver State
Risk Score
Heart Rate
Driving Conditions
Location
```

This allows it to provide context-aware safety guidance.

---

## 📊 Drive Dashboard

The dashboard brings the entire safety system together in one place.

```text
┌──────────────────────────────────────────────┐
│                  DRIVEX                      │
├───────────────┬──────────────────────────────┤
│ Driver State  │       Risk Score             │
│    ALERT      │          0 / 10              │
├───────────────┼──────────────────────────────┤
│ Heart Rate    │       Vehicle Data           │
│    76 BPM     │ Speed • Temp • Battery       │
├───────────────┴──────────────────────────────┤
│              Live Location                   │
│                                              │
│                  🗺️                          │
├──────────────────────────────────────────────┤
│              AI Safety Copilot               │
└──────────────────────────────────────────────┘
```

---

## 🔐 Authentication & Profiles

DriveX includes a complete user flow:

* 🔑 Registration & login
* 👤 Driver profile
* 🚘 Vehicle profile
* 👥 Emergency contacts
* 📜 Drive history
* 🔒 Session-based user experience

---

## 🛣️ Drive Sessions

A drive follows a simple flow:

```text
LOGIN
  ↓
DASHBOARD
  ↓
START DRIVE
  ↓
PRE-DRIVE CHECK
  ↓
ACTIVE DRIVE
  ↓
MONITORING
  ↓
RISK / EMERGENCY
  ↓
END DRIVE
  ↓
DRIVE SUMMARY
```

This keeps the safety features connected to an actual driving session rather than displaying isolated sensor data.

---

## 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-2026?style=for-the-badge\&logo=react\&logoColor=white)

* React
* Vite
* JavaScript
* CSS
* React Leaflet
* MediaPipe Tasks Vision

### Backend

![Node.js](https://img.shields.io/badge/Node.js-2026?style=for-the-badge\&logo=node.js\&logoColor=white)

* Node.js
* Express.js
* REST APIs
* MongoDB
* Mongoose
* bcrypt

### AI & Deployment

* 🤖 OpenRouter
* ☁️ Vercel
* 🚀 Render
* 🍃 MongoDB Atlas

---

## 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │     DriveX UI    │
                    │ React + Vite     │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Safety Systems   │
                    │                  │
                    │ Driver Monitoring│
                    │ Telemetry        │
                    │ Risk Engine      │
                    │ Location         │
                    │ Emergency System │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Express Backend  │
                    │ REST API         │
                    └───────┬────┬─────┘
                            │    │
                  ┌─────────▼┐  ┌▼────────────┐
                  │ MongoDB  │  │ AI Copilot  │
                  │ Atlas    │  │ OpenRouter  │
                  └──────────┘  └─────────────┘
```

---

## 📂 Project Structure

```text
DriveX/
│
├── src/
│   ├── components/
│   ├── camera/
│   ├── drive/
│   ├── telemetry/
│   ├── simulator/
│   ├── data/
│   ├── pages/
│   └── ...
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── public/
├── package.json
└── README.md
```

---

## ⚙️ Run Locally

### 1. Clone

```bash
git clone https://github.com/bhaskarj20/DriveX.git
cd DriveX
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Environment Variables

Create `.env` in the project root:

```env
VITE_API_URL=http://localhost:5000
```

Create `.env` inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 5. Start backend

```bash
cd backend
node server.js
```

### 6. Start frontend

In another terminal:

```bash
npm run dev
```

---

## 🌐 Deployment

DriveX is deployed using:

```text
Frontend
   │
   ▼
Vercel
   │
   ▼
Express API
   │
   ├──────────► Render
   │
   └──────────► MongoDB Atlas
```

The AI Safety Copilot connects through the deployed application environment.

---

## ⚠️ Note

DriveX is a **prototype safety platform** and should not be treated as a replacement for professional vehicle safety systems, emergency services, or certified medical equipment.

Some sensor inputs can be simulated for demonstration purposes.

---

## 👥 Team

Built with ❤️ as a collaborative project focused on exploring how **AI, computer vision, telemetry, and real-time web technologies** can be combined to improve driver safety.

---

<p align="center">

### 🚗 DriveX

**Monitor the driver. Understand the drive. Reduce the risk.**

</p>
