//JUNIOR GIRLS
// ------------------ Standings ------------------
fetch("flagjgstandings.json")
  .then((response) => response.json())
  .then((data) => {
    const placeholder = document.querySelector("#data-output");
    let standings = data.standings || [];

    function parseNumber(v) {
      if (v === undefined || v === null) return 0;
      const s = String(v).trim();
      const m = s.match(/-?\d+(\.\d+)?/);
      return m ? Number(m[0]) : 0;
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

    // Group teams under their detected division
    let grouped = {};
    for (const div of divisions) grouped[div] = [];

    for (let i = 0; i < standings.length; i++) {
      const team = standings[i];
      if (divisions.includes(team.Team)) continue; // skip divider row
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
        // Division header row (with proper labels)
        out += `
          <tr class="division-row">
            <td>${div}</td>
            <td>GP</td>
            <td>W</td>
            <td>L</td>
            <td>T</td>
            <td>PTS</td>
            <td>PF</td>
            <td>PA</td>
            <td>DIFF</td>
          </tr>
        `;

        grouped[div].sort((a, b) => {
          let valA, valB;
          if (sortColumn === "DIFF") {
            valA = parseNumber(a.PF) - parseNumber(a.PA);
            valB = parseNumber(b.PF) - parseNumber(b.PA);
          } else {
            valA = parseNumber(a[sortColumn]);
            valB = parseNumber(b[sortColumn]);
          }
          return ascending ? valA - valB : valB - valA;
        });

        for (const team of grouped[div]) {
          const pf = parseNumber(team.PF);
          const pa = parseNumber(team.PA);
          const diff = pf - pa;

          out += `
            <tr>
              <td>${team.Team ?? ""}</td>
              <td class="${sortColumn === "GP" ? "active-col" : ""}">${
            team.GP ?? ""
          }</td>
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
              <td class="${sortColumn === "PF" ? "active-col" : ""}">${
            team.PF ?? ""
          }</td>
              <td class="${sortColumn === "PA" ? "active-col" : ""}">${
            team.PA ?? ""
          }</td>
              <td class="${
                sortColumn === "DIFF" ? "active-col" : ""
              }">${diff}</td>
            </tr>
          `;
        }
      }
      placeholder.innerHTML = out;

      // Update header arrows
      const headerNames = {
        Team: "Team",
        GP: "Games Played",
        W: "Wins",
        L: "Losses",
        T: "Ties",
        PTS: "Points",
        PF: "Points For",
        PA: "Points Against",
        DIFF: "Point Differential",
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

    fetch("flagjgstandings.json", { method: "HEAD" }).then((res) => {
      const lastModified = res.headers.get("last-modified");
      if (lastModified) {
        document.getElementById("last-updated").textContent =
          "Standings last updated: " + new Date(lastModified).toLocaleString();
      }
    });
  })
  .catch((error) => console.error("Error loading standings:", error));

// ------------------ Schedule ------------------
fetch("jgschedule.json")
  .then(async (response) => {
    const lastModified = response.headers.get("last-modified");
    const data = await response.json();
    return { data, lastModified };
  })
  .then(({ data, lastModified }) => {
    const placeholder = document.querySelector("#schedule-output");
    let out = "";

    if (data.schedule && data.schedule.length > 0) {
      for (const game of data.schedule) {
        if (!game.home_team && !game.away_team) {
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
                    <td>${game.home_team ?? ""}</td>
                    <td>${game.away_team ?? ""}</td>
                    <td>${game.time || "-"}</td>
                    <td>${game.location || "-"}</td>
                    <td>${game.final_score ? game.final_score : "-"}</td>
                  </tr>
                `;
        }
      }
      placeholder.innerHTML = out;
    }

    const el = document.getElementById("schedule-last-updated");
    if (el) {
      if (lastModified) {
        el.textContent =
          "Schedule last updated: " + new Date(lastModified).toLocaleString();
      } else {
        fetch("jgschedule.json", { method: "HEAD" })
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

//SENIOR GIRLS

// ------------------ Standings ------------------
fetch("flagsgstandings.json")
  .then((response) => response.json())
  .then((data) => {
    const placeholder = document.querySelector("#data-output");
    let standings = data.standings || [];

    function parseNumber(v) {
      if (v === undefined || v === null) return 0;
      const s = String(v).trim();
      const m = s.match(/-?\d+(\.\d+)?/);
      return m ? Number(m[0]) : 0;
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

    // Group teams under their detected division
    let grouped = {};
    for (const div of divisions) grouped[div] = [];

    for (let i = 0; i < standings.length; i++) {
      const team = standings[i];
      if (divisions.includes(team.Team)) continue; // skip divider row
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
        // Division header row (with proper labels)
        out += `
          <tr class="division-row">
            <td>${div}</td>
            <td>GP</td>
            <td>W</td>
            <td>L</td>
            <td>T</td>
            <td>PTS</td>
            <td>PF</td>
            <td>PA</td>
            <td>DIFF</td>
          </tr>
        `;

        grouped[div].sort((a, b) => {
          let valA, valB;
          if (sortColumn === "DIFF") {
            valA = parseNumber(a.PF) - parseNumber(a.PA);
            valB = parseNumber(b.PF) - parseNumber(b.PA);
          } else {
            valA = parseNumber(a[sortColumn]);
            valB = parseNumber(b[sortColumn]);
          }
          return ascending ? valA - valB : valB - valA;
        });

        for (const team of grouped[div]) {
          const pf = parseNumber(team.PF);
          const pa = parseNumber(team.PA);
          const diff = pf - pa;

          out += `
            <tr>
              <td>${team.Team ?? ""}</td>
              <td class="${sortColumn === "GP" ? "active-col" : ""}">${
            team.GP ?? ""
          }</td>
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
              <td class="${sortColumn === "PF" ? "active-col" : ""}">${
            team.PF ?? ""
          }</td>
              <td class="${sortColumn === "PA" ? "active-col" : ""}">${
            team.PA ?? ""
          }</td>
              <td class="${
                sortColumn === "DIFF" ? "active-col" : ""
              }">${diff}</td>
            </tr>
          `;
        }
      }
      placeholder.innerHTML = out;

      // Update header arrows
      const headerNames = {
        Team: "Team",
        GP: "Games Played",
        W: "Wins",
        L: "Losses",
        T: "Ties",
        PTS: "Points",
        PF: "Points For",
        PA: "Points Against",
        DIFF: "Point Differential",
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

    fetch("flagsgstandings.json", { method: "HEAD" }).then((res) => {
      const lastModified = res.headers.get("last-modified");
      if (lastModified) {
        document.getElementById("last-updated").textContent =
          "Standings last updated: " + new Date(lastModified).toLocaleString();
      }
    });
  })
  .catch((error) => console.error("Error loading standings:", error));

// ------------------ Schedule ------------------
fetch("sgschedule.json")
  .then(async (response) => {
    const lastModified = response.headers.get("last-modified");
    const data = await response.json();
    return { data, lastModified };
  })
  .then(({ data, lastModified }) => {
    const placeholder = document.querySelector("#schedule-output");
    let out = "";

    if (data.schedule && data.schedule.length > 0) {
      for (const game of data.schedule) {
        if (!game.home_team && !game.away_team) {
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
                    <td>${game.home_team ?? ""}</td>
                    <td>${game.away_team ?? ""}</td>
                    <td>${game.time || "-"}</td>
                    <td>${game.location || "-"}</td>
                    <td>${game.final_score ? game.final_score : "-"}</td>
                  </tr>
                `;
        }
      }
      placeholder.innerHTML = out;
    }

    const el = document.getElementById("schedule-last-updated");
    if (el) {
      if (lastModified) {
        el.textContent =
          "Schedule last updated: " + new Date(lastModified).toLocaleString();
      } else {
        fetch("sgschedule.json", { method: "HEAD" })
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
