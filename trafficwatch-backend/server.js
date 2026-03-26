const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*" // Or restrict to GitHub Pages if needed
}));

// ===== Serve Frontend =====
app.use(express.static(path.join(__dirname, 'Frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

// ===== Example API Route =====
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ===== TODO: Add all your API routes here =====
// e.g., /api/auth/register, /api/auth/login, /api/incidents, etc.

app.listen(PORT, () => {
  console.log(`🚦 TrafficWatch running on port ${PORT}`);
});