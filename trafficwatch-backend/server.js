const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, 'Frontend')));

// SPA fallback
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

// Example API route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => console.log(`🚦 Server running on port ${PORT}`));