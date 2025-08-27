// ------------------ Standings ------------------
fetch("baseballtier1standings.json")
  .then((response) => response.json())
  .then((data) => {
    let placeholder = document.querySelector("#data-output");
    let out = "";

    if (data.standings && data.standings.length > 0) {
      for (let team of data.standings) {
        let isDivision =
          team.Team === "Central" ||
          team.Team === "East" ||
          team.Team === "North" ||
          team.Team === "West";

        let divisionClass = isDivision ? "division-row" : "";

        out += `
          <tr class="${divisionClass}">
            <td>${team.Team}</td>
            <td>${team.W}</td>
            <td>${team.L}</td>
            <td>${team.T}</td>
            <td>${team.PTS}</td>
            <td>${team.RF}</td>
            <td>${team.RA}</td>
            <td>${team.DIFF}</td>
          </tr>
        `;
      }
      placeholder.innerHTML = out;
    }

    // Last updated (standings)
    fetch("baseballtier1standings.json", { method: "HEAD" }).then((res) => {
      let lastModified = res.headers.get("last-modified");
      if (lastModified) {
        document.getElementById("last-updated").textContent =
          "Last updated: " + new Date(lastModified).toLocaleString();
      }
    });
  })
  .catch((error) => console.error("Error loading standings:", error));

// ------------------ Schedule ------------------
fetch("schedule.json")
  .then((response) => response.json())
  .then((data) => {
    let placeholder = document.querySelector("#schedule-output");
    let out = "";

    if (data.schedule && data.schedule.length > 0) {
      for (let game of data.schedule) {
        if (!game.home_team && !game.away_team) {
          // Case 5: No games scheduled
          out += `
            <tr>
              <td>${game.date}</td>
              <td colspan="5">No games scheduled</td>
            </tr>
          `;
        } else {
          out += `
            <tr>
              <td>${game.date}</td>
              <td>${game.home_team}</td>
              <td>${game.away_team}</td>
              <td>${game.time || "-"}</td>
              <td>${game.location || "-"}</td>
              <td>${game.final_score ? game.final_score : "-"}</td>
            </tr>
          `;
        }
      }
      placeholder.innerHTML = out;
    }
  })
  .catch((error) => console.error("Error loading schedule:", error));
