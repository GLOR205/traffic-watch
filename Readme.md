# TrafficWatch RW — Smart Traffic Response System (STRS)

> A web-based traffic incident reporting and management platform for Kigali, Rwanda.

---

## 🌐 Live Demo
**[https://glor205.github.io/trafficwatch/](https://glor205.github.io/trafficwatch/)**

---

## 📋 Project Overview

TrafficWatch RW is the frontend prototype for the Smart Traffic Response System (STRS), developed as part of a software engineering summative project. It allows citizens to report traffic incidents, police/admins to manage and resolve them, and emergency services to respond to high-priority alerts — all through a clean, mobile-friendly web interface.

### The Problem
Kigali lacks a centralized real-time digital platform for reporting and managing traffic issues. Authorities face delayed responses, poor incident tracking, and limited ability to reroute traffic or dispatch emergency services quickly.

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

- User registration and login (with role selection)
- Report incidents: Accident, Traffic Jam, Road Blockage, Broken Light, Road Damage
- Priority levels: High, Medium, Low
- Status tracking: Pending → In Progress → Resolved
- Live traffic map with incident pins
- Emergency alerts panel for high-priority incidents
- Dashboard with live stats
- Mobile-friendly phone-frame design

---

## 🗂️ Project Structure

```
trafficwatch-rw/
├── Frontend/
│   └── index.html          ← Main frontend application
├── trafficwatch-backend/
│   ├── server.js           ← Node.js + Express REST API
│   ├── package.json        ← Backend dependencies
│   └── trafficwatch.db     ← SQLite database (auto-created)
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have these installed on your computer:
- [Node.js](https://nodejs.org) (version 14 or higher)
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com) (recommended)
- VS Code extension: **Live Server** (by Ritwick Dey)

---

### Step 1 — Clone the repository

Open your terminal or VS Code terminal and run:

```bash
git clone https://github.com/GLOR205/trafficwatch-rw.git
cd trafficwatch-rw
```

---

### Step 2 — Set up and run the backend

```bash
# Go into the backend folder
cd trafficwatch-backend

# Install dependencies
npm install

# Start the backend server
node server.js
```

You should see:
```
✅ Database ready — trafficwatch.db
🚦 TrafficWatch RW backend running on http://localhost:3000
```

> The SQLite database file (`trafficwatch.db`) is created automatically on first run. No extra database setup needed.

---

### Step 3 — Open the frontend

1. In VS Code, go to **File → Open Folder** and open the **Frontend** folder
2. Right-click `index.html` in the Explorer panel
3. Click **Open with Live Server**

The app will open at: `http://127.0.0.1:5500`

---

### Step 4 — Use the app

1. Click **Register** to create a new account
2. Choose your role: Citizen, Police, or Emergency Services
3. Log in with your email and password
4. As a **Citizen**: submit a traffic report
5. Log out and log in as **Police** to manage incidents
6. Log out and log in as **Emergency Services** to see high-priority alerts

---

## 🔌 Backend API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/users` | List all users |
| GET | `/api/incidents` | Get all incidents (supports filters) |
| GET | `/api/incidents/:id` | Get one incident by ID |
| POST | `/api/incidents` | Report a new incident |
| PUT | `/api/incidents/:id` | Update incident status or notes |
| DELETE | `/api/incidents/:id` | Delete an incident |
| GET | `/api/stats` | Get live dashboard statistics |

### Filter incidents by query:
```
GET /api/incidents?status=Pending
GET /api/incidents?priority=High
GET /api/incidents?reporter_id=1
GET /api/incidents?type=Accident
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | SQLite (via better-sqlite3) |
| Hosting | GitHub Pages (frontend) |

---

## 📄 SRS Document

[View the Software Requirements Specification (SRS)]
https://docs.google.com/document/d/1Rd1LYLd59Se90WhaTWNoPQo4XHbTzsOm/edit?usp=sharing&ouid=117931866481247386056&rtpof=true&sd=true

---

## 👩‍💻 Author

**Gloria Muhorakeye**
Software Engineering Summative Project — 2026