const express = require("express");
const app = express();
const PORT = 8080;

// Static Files
app.use(express.static("public"));

// Match Schedule API
app.get("/api/schedule", (req, res) => {
  const schedule = [
    { teams: "Team A vs Team B", date: "2025-03-23", time: "7:30 PM" },
    { teams: "Team C vs Team D", date: "2025-03-24", time: "7:30 PM" },
  ];
  res.json(schedule);
});

// Live Score API
app.get("/api/live-score", (req, res) => {
  const liveScore = {
    match: "Team A vs Team B",
    score: "150/3",
    overs: "15.2",
  };
  res.json(liveScore);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
