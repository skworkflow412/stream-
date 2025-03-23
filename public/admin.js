const matchList = document.getElementById("match-list");

function fetchMatches() {
  fetch("/api/matches")
    .then(res => res.json())
    .then(matches => {
      matchList.innerHTML = matches.map(match => `
        <div class="match">
          <h3>${match.teams}</h3>
          <p>Date: ${match.date}, Time: ${match.time}</p>
          <p>Live Streaming: ${match.streamingLink || "Not Set"}</p>
          <p>Live Score: ${match.liveScore || "Not Available"}</p>
          <label>
            <input type="checkbox" class="auto-score-toggle" data-id="${match.matchId}" ${match.autoScoreEnabled ? "checked" : ""} />
            Auto Score
          </label>
          <button class="delete-btn" data-id="${match.matchId}">Delete</button>
        </div>
      `).join("");

      attachEventListeners();
    });
}

function attachEventListeners() {
  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      fetch(`/api/matches/${id}`, { method: "DELETE" }).then(() => fetchMatches());
    });
  });

  document.querySelectorAll(".auto-score-toggle").forEach(toggle => {
    toggle.addEventListener("change", () => {
      const id = toggle.dataset.id;
      const autoScoreEnabled = toggle.checked;
      fetch(`/api/matches/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoScoreEnabled }),
      });
    });
  });
}

document.getElementById("match-form").addEventListener("submit", event => {
  event.preventDefault();

  const matchId = document.getElementById("match-id").value;
  const teams = document.getElementById("teams").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const streamingLink = document.getElementById("streaming-link").value;

  fetch("/api/matches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matchId, teams, date, time, streamingLink }),
  }).then(() => {
    document.getElementById("match-form").reset();
    fetchMatches();
  });
});

fetchMatches();
