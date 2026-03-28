const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ── SERVE FRONTEND ──
app.use(express.static(path.join(__dirname, "Frontend")));

// temporary storage for reports
let reports = [];

// HOME — serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "index.html"));
});

// GET all reports
app.get("/reports", (req, res) => {
  res.json(reports);
});

// POST a new report
app.post("/reports", (req, res) => {
  const report = {
    id: Date.now(),
    type: req.body.type,
    description: req.body.description,
    location: req.body.location,
    createdAt: new Date()
  };
  reports.push(report);
  res.json({
    message: "Report submitted successfully",
    report: report
  });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TrafficWatch running on port ${PORT}`);
  console.log(`Frontend folder: ${path.join(__dirname, "Frontend")}`);
});
