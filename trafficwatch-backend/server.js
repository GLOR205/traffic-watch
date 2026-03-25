const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// temporary storage for reports
let reports = [];

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
app.listen(3000, () => {
  console.log("TrafficWatch backend running on port 3000");
});