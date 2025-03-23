const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 8080;

// Fake database
let matches = [];

// Cricket API setup
const API_KEY = "YOUR_CRICAPI_KEY";
const CRICKET_API_URL = "https://api.cricapi.com/v1/currentMatches";

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve User Website
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve Admin Panel
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Add Match
app.post("/api/matches", (req, res) => {
  const { matchId, teams, date, time, streamingLink } = req.body;
  matches.push({
    matchId,
    teams,
    date,
    time,
    streamingLink,
    liveScore: null,
    autoScoreEnabled: true,
  });
  res.status(201).json({ message: "Match added successfully", matches });
});

// Update Match Settings
app.put("/api/matches/:id", (req, res) => {
  const { id } = req.params;
  const { streamingLink, autoScoreEnabled } = req.body;

  const match = matches.find(m => m.matchId === id);
  if (!match) {
    return res.status(404).json({ message: "Match not found" });
  }

  match.streamingLink = streamingLink || match.streamingLink;
  match.autoScoreEnabled = autoScoreEnabled ?? match.autoScoreEnabled;

  res.json({ message: "Match updated successfully", match });
});

// Delete Match
app.delete("/api/matches/:id", (req, res) => {
  const { id } = req.params;
  matches = matches.filter(m => m.matchId !== id);
  res.json({ message: "Match deleted successfully", matches });
});

// Fetch Live Scores
app.get("/api/live-scores", async (req, res) => {
  try {
    const response = await axios.get(CRICKET_API_URL, { params: { apikey: API_KEY } });
    const liveMatches = response.data.data.filter(match => match.series === "Indian Premier League");

    liveMatches.forEach(liveMatch => {
      const match = matches.find(m => m.matchId === liveMatch.id);
      if (match && match.autoScoreEnabled) {
        match.liveScore = `${liveMatch.score[0].r}/${liveMatch.score[0].w} Overs: ${liveMatch.score[0].o}`;
      }
    });

    res.json(matches);
  } catch (error) {
    console.error("Error fetching live scores:", error.message);
    res.status(500).json({ message: "Error fetching live scores" });
  }
});

// Get Matches
app.get("/api/matches", (req, res) => {
  res.json(matches);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
