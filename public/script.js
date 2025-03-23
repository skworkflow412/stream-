fetch("/api/matches")
  .then(res => res.json())
  .then(matches => {
    const matchList = document.getElementById("match-list");
    matchList.innerHTML = matches.map(match => `
      <div class="match">
        <h3>${match.teams}</h3>
        <p>Live Score: ${match.liveScore || "Not Available"}</p>
        ${match.streamingLink ? `<a href="${match.streamingLink}" target="_blank">Watch Live</a>` : ""}
      </div>
    `).join("");
  });
