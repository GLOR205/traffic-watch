# TrafficWatch RW — Smart Traffic Response System (STRS)

> A web-based traffic incident reporting and management platform for Kigali, Rwanda.

---

## 🌐 Live Application
**[https://traffic-watch.onrender.com](https://traffic-watch.onrender.com)**

> Anyone can open this link in any browser on any device and use the full app.

---

## 📋 Project Overview

**TrafficWatch RW** is the prototype for the Smart Traffic Response System (STRS), developed as a software engineering summative project. It solves the problem of Kigali lacking a centralized real-time digital platform for reporting and managing traffic issues.

### The Problem
Kigali lacks a centralized real-time digital platform for reporting and managing traffic issues. Authorities face delayed responses, poor incident tracking, and limited ability to reroute traffic or dispatch emergency services quickly — worsening congestion and reducing the effectiveness of traffic management.

### The Solution
A centralized web platform where:
- **Citizens** report traffic incidents in real time
- **Police / Traffic Admins** manage and update incident status
- **Emergency Services** receive and respond to high-priority alerts

---

## 👥 User Roles

| Role | What they can do |
|------|-----------------|
| **Citizen** | Register, log in, report incidents, track own reports |
| **Police / Admin** | View all incidents, update status, add notes |
| **Emergency Services** | View and respond to high-priority alerts |

---

## ✅ Features

- User registration and login with role selection
- Report incidents: Accident, Traffic Jam, Road Blockage, Broken Light, Road Damage
- Priority levels: High 🔴, Medium 🟡, Low 🔵
- Status tracking: Pending → In Progress → Resolved
- Live traffic map with incident pins
- Emergency alerts panel for high-priority incidents
- Dashboard with live stats
- Mobile-friendly phone-frame design

---

## 🗂️ Project Structure

```
traffic-watch/
├── trafficwatch-backend/
│   ├── Frontend/
│   │   └── index.html        ← Frontend application
│   ├── server.js             ← Node.js + Express backend
│   ├── package.json          ← Dependencies
│   └── package-lock.json
├── .gitignore
└── README.md
```

---

## 🚀 How to Run Locally (Step by Step)

### Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org) — download and install (version 14 or higher)
- [Git](https://git-scm.com) — download and install
- [VS Code](https://code.visualstudio.com) — recommended code editor

---

### Step 1 — Clone the repository

Open your terminal or VS Code terminal and run:

```bash
git clone https://github.com/GLOR205/traffic-watch.git
cd traffic-watch
```

---

### Step 2 — Go into the backend folder

```bash
cd trafficwatch-backend
```

---

### Step 3 — Install dependencies

```bash
npm install
```

This installs `express` and `cors` — no extra tools needed.

---

### Step 4 — Start the server

```bash
node server.js
```

You should see:
```
TrafficWatch running on port 3000
```

---

### Step 5 — Open the app

Open your browser and go to:
```
http://localhost:3000
```

Your full TrafficWatch app will load — both frontend and backend running together.

---

## 🔌 API Endpoints

Base URL (live): `https://traffic-watch.onrender.com`
Base URL (local): `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Loads the frontend app |
| GET | `/reports` | Get all submitted reports |
| POST | `/reports` | Submit a new report |

### Example — Submit a report:
```json
POST /reports
{
  "type": "Accident",
  "description": "Two-vehicle collision near roundabout",
  "location": "Kacyiru, KN 3 Ave"
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Hosting | Render (frontend + backend together) |

---

## 🧪 How to Test the Live App

1. Open **[https://traffic-watch.onrender.com](https://traffic-watch.onrender.com)**
2. Click **Register** — create a Citizen account
3. Log in and submit a traffic report
4. Log out → Register a **Police** account
5. Log in as Police — manage and resolve the report
6. Log out → Register an **Emergency Services** account
7. Log in as Emergency — view high-priority alerts

---

## 📄 SRS Document

[View the Software Requirements Specification](https://docs.google.com/document/u/0/)

---

## 👩‍💻 Author

**Gloria Muhorakeye**  
Software Engineering Summative Project — 2026  
GitHub: [@GLOR205](https://github.com/GLOR205)