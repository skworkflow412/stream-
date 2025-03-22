// Dark Mode Toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Fetch Match Schedule
const matchSchedule = document.getElementById("match-schedule");
fetch("/api/schedule")
  .then(response => response.json())
  .then(data => {
    matchSchedule.innerHTML = data.map(match => `
      <div>
        <h3>${match.teams}</h3>
        <p>${match.date} - ${match.time}</p>
      </div>
    `).join("");
  })
  .catch(err => {
    matchSchedule.innerHTML = "<p>Failed to load match schedule.</p>";
  });

// Fetch Live Scores
const scoreWidget = document.getElementById("score-widget");
fetch("/api/live-score")
  .then(response => response.json())
  .then(data => {
    scoreWidget.innerHTML = `
      <h3>${data.match}</h3>
      <p>Score: ${data.score}</p>
      <p>Overs: ${data.overs}</p>
    `;
  })
  .catch(err => {
    scoreWidget.innerHTML = "<p>Failed to fetch live scores.</p>";
  });
