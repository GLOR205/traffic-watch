// server.js — TrafficWatch RW Railway-ready backend

const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// ===== Database Setup =====
const db = new Database(path.join(__dirname, 'trafficwatch.db'));

// Create tables if they don't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    location TEXT,
    description TEXT,
    priority TEXT,
    status TEXT DEFAULT 'Pending',
    reporter_id INTEGER,
    FOREIGN KEY(reporter_id) REFERENCES users(id)
  )
`).run();

// ===== API Routes =====

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const stmt = db.prepare(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`);
    const info = stmt.run(name, email, password, role);
    res.json({ success: true, user_id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare(`SELECT * FROM users WHERE email = ? AND password = ?`).get(email, password);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get all users
app.get('/api/users', (req, res) => {
  const users = db.prepare(`SELECT id, name, email, role FROM users`).all();
  res.json(users);
});

// Create new incident
app.post('/api/incidents', (req, res) => {
  const { type, location, description, priority, reporter_id } = req.body;
  try {
    const stmt = db.prepare(`
      INSERT INTO incidents (type, location, description, priority, reporter_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(type, location, description, priority, reporter_id);
    res.json({ success: true, incident_id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get all incidents (with optional filters)
app.get('/api/incidents', (req, res) => {
  const { status, priority, reporter_id, type } = req.query;
  let query = `SELECT * FROM incidents WHERE 1=1`;
  const params = [];
  if (status) { query += ` AND status = ?`; params.push(status); }
  if (priority) { query += ` AND priority = ?`; params.push(priority); }
  if (reporter_id) { query += ` AND reporter_id = ?`; params.push(reporter_id); }
  if (type) { query += ` AND type = ?`; params.push(type); }

  const incidents = db.prepare(query).all(...params);
  res.json(incidents);
});

// Get single incident
app.get('/api/incidents/:id', (req, res) => {
  const incident = db.prepare(`SELECT * FROM incidents WHERE id = ?`).get(req.params.id);
  if (incident) res.json(incident);
  else res.status(404).json({ message: 'Incident not found' });
});

// Update incident
app.put('/api/incidents/:id', (req, res) => {
  const { status, description } = req.body;
  try {
    const stmt = db.prepare(`
      UPDATE incidents
      SET status = COALESCE(?, status),
          description = COALESCE(?, description)
      WHERE id = ?
    `);
    stmt.run(status, description, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete incident
app.delete('/api/incidents/:id', (req, res) => {
  db.prepare(`DELETE FROM incidents WHERE id = ?`).run(req.params.id);
  res.json({ success: true });
});

// Dashboard stats
app.get('/api/stats', (req, res) => {
  const totalIncidents = db.prepare(`SELECT COUNT(*) AS count FROM incidents`).get().count;
  const pending = db.prepare(`SELECT COUNT(*) AS count FROM incidents WHERE status='Pending'`).get().count;
  const inProgress = db.prepare(`SELECT COUNT(*) AS count FROM incidents WHERE status='In Progress'`).get().count;
  const resolved = db.prepare(`SELECT COUNT(*) AS count FROM incidents WHERE status='Resolved'`).get().count;
  res.json({ totalIncidents, pending, inProgress, resolved });
});

// ===== Serve Frontend =====
app.use(express.static(path.join(__dirname, 'Frontend')));

// SPA fallback (must come last!)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

// ===== Start Server =====
app.listen(PORT, () => console.log(`🚦 Server running on port ${PORT}`));