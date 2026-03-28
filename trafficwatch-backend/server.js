const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ── SERVE FRONTEND ──
// This serves your index.html and any other files in the Frontend folder
app.use(express.static(path.join(__dirname, "Frontend")));

// temporary storage for reports
let reports = [];

// HOME route — serves your frontend app
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

// start server — use process.env.PORT for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TrafficWatch backend running on port ${PORT}`);
});
  });

});

// start server
app.listen(3000, () => {
  console.log("TrafficWatch backend running on port 3000");
});
