//TIER 1

// ------------------ Standings ------------------
fetch("slopitchstandings.json")
  .then((response) => response.json())
  .then((data) => {
    const placeholder = document.querySelector("#data-output");
    let standings = data.standings || [];

    function parseNumber(v) {
      if (v === undefined || v === null) return 0;
      const n = Number(v);
      return isNaN(n) ? 0 : n;
    }

    //  Auto-detect divisions (rows with Team exactly equal to "Central", "East", etc.)
    let divisions = [];
    for (const team of standings) {
      if (
        team.Team &&
        [
          "Central",
          "East",
          "North",
          "West",
          "Central 1",
          "North-Central",
          "North 1",
          "North-East",
          "Central-West",
          "South-Central",
          "East 1",
          "East 2",
        ].includes(team.Team)
      ) {
        divisions.push(team.Team);
      }
    }

    // Group teams under divisions
    let grouped = {};
    for (const div of divisions) grouped[div] = [];

    for (let i = 0; i < standings.length; i++) {
      const team = standings[i];
      if (divisions.includes(team.Team)) continue; // skip header rows
      let div = null;
      for (let j = i; j >= 0; j--) {
        if (divisions.includes(standings[j].Team)) {
          div = standings[j].Team;
          break;
        }
      }
      if (div) grouped[div].push(team);
    }

    function render(sortColumn = "PTS", ascending = false) {
      let out = "";

      for (const div of divisions) {
        // Division header row
        out += `
          <tr class="division-row">
            <td>${div}</td>
            <td>W</td>
            <td>L</td>
            <td>T</td>
            <td>PTS</td>
            <td>RF</td>
            <td>RA</td>
            <td>DIFF</td>
          </tr>
        `;

        // Sort teams (skip division headers)
        grouped[div].sort((a, b) => {
          let valA = parseNumber(a[sortColumn]);
          let valB = parseNumber(b[sortColumn]);
          return ascending ? valA - valB : valB - valA;
        });

        // Render rows
        for (const team of grouped[div]) {
          out += `
            <tr>
              <td>${team.Team ?? ""}</td>
              <td class="${sortColumn === "W" ? "active-col" : ""}">${
            team.W ?? ""
          }</td>
              <td class="${sortColumn === "L" ? "active-col" : ""}">${
            team.L ?? ""
          }</td>
              <td class="${sortColumn === "T" ? "active-col" : ""}">${
            team.T ?? ""
          }</td>
              <td class="${sortColumn === "PTS" ? "active-col" : ""}">${
            team.PTS ?? ""
          }</td>
              <td class="${sortColumn === "RF" ? "active-col" : ""}">${
            team.RF ?? ""
          }</td>
              <td class="${sortColumn === "RA" ? "active-col" : ""}">${
            team.RA ?? ""
          }</td>
              <td class="${sortColumn === "DIFF" ? "active-col" : ""}">${
            team.DIFF ?? ""
          }</td>
            </tr>
          `;
        }
      }

      placeholder.innerHTML = out;

      const headerNames = {
        Team: "Team",
        W: "Wins",
        L: "Losses",
        T: "Ties",
        PTS: "Points",
        RF: "Runs For",
        RA: "Runs Against",
        DIFF: "Run Differential",
      };

      // Update header arrows
      document.querySelectorAll("th[data-column]").forEach((th) => {
        const col = th.dataset.column;
        th.textContent = headerNames[col]; // Use full name
        if (col === sortColumn) {
          th.textContent += ascending ? " ▲" : " ▼";
        }
      });
    }

    let currentSort = { column: "Team", ascending: false };
    render(currentSort.column, currentSort.ascending);

    // Clickable headers
    document.querySelectorAll("th[data-column]").forEach((th) => {
      th.style.cursor = "pointer";
      th.addEventListener("click", () => {
        const col = th.dataset.column;
        if (currentSort.column === col) {
          currentSort.ascending = !currentSort.ascending;
        } else {
          currentSort.column = col;
          currentSort.ascending = false;
        }
        render(currentSort.column, currentSort.ascending);
      });
    });

    fetch("slopitchstandings.json", { method: "HEAD" }).then((res) => {
      const lastModified = res.headers.get("last-modified");
      if (lastModified) {
        document.getElementById("last-updated").textContent =
          "Standings last updated: " + new Date(lastModified).toLocaleString();
      }
    });
  })
  .catch((error) => console.error("Error loading standings:", error));

// ------------------ Schedule ------------------
fetch("t1schedule.json")
  .then(async (response) => {
    // Try to read last-modified right away
    const lastModified = response.headers.get("last-modified");
    const data = await response.json();
    return { data, lastModified };
  })
  .then(({ data, lastModified }) => {
    let placeholder = document.querySelector("#schedule-output");
    let out = "";

    if (data.schedule && data.schedule.length > 0) {
      for (let game of data.schedule) {
        if (!game.home_team && !game.away_team) {
          // No games scheduled for this date
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

    // Show Last updated under the schedule table
    const el = document.getElementById("schedule-last-updated");
    if (el) {
      if (lastModified) {
        el.textContent =
          "Schedule last updated: " + new Date(lastModified).toLocaleString();
      } else {
        // Fallback: try a HEAD request if the first response lacked the header
        fetch("t1schedule.json", { method: "HEAD" })
          .then((res) => {
            const lm = res.headers.get("last-modified");
            if (lm) {
              el.textContent =
                "Schedule last updated: " + new Date(lm).toLocaleString();
            }
          })
          .catch(() => {});
      }
    }
  })
  .catch((error) => console.error("Error loading schedule:", error));
