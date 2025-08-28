//JUNIOR BOYS
// ------------------ Standings ------------------
fetch("basketballjbstandings.json")
  .then((response) => response.json())
  .then((data) => {
    const placeholder = document.querySelector("#data-output");
    let out = "";

    if (data.standings && data.standings.length > 0) {
      for (const team of data.standings) {
        const isDivision =
          team.Team === "Central" ||
          team.Team === "East" ||
          team.Team === "North" ||
          team.Team === "West";

        const divisionClass = isDivision ? "division-row" : "";

        out += `
                <tr class="${divisionClass}">
                  <td>${team.Team ?? ""}</td>
                  <td>${team.W ?? ""}</td>
                  <td>${team.L ?? ""}</td>
                  <td>${team.T ?? ""}</td>
                  <td>${team.PTS ?? ""}</td>
                  <td>${team.RF ?? team.PF ?? ""}</td>
                  <td>${team.RA ?? team.PA ?? ""}</td>
                  <td>${team.DIFF ?? ""}</td>
                </tr>
              `;
      }
      placeholder.innerHTML = out;
    }

    // Last updated (standings)
    fetch("basketballjbstandings.json", { method: "HEAD" }).then((res) => {
      const lastModified = res.headers.get("last-modified");
      if (lastModified) {
        document.getElementById("last-updated").textContent =
          "Standings last updated: " + new Date(lastModified).toLocaleString();
      }
    });
  })
  .catch((error) => console.error("Error loading standings:", error));

// ------------------ Schedule ------------------
fetch("jbschedule.json")
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
        fetch("jbschedule.json", { method: "HEAD" })
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

//JUNIOR GIRLS

// ------------------ Standings ------------------
fetch("basketballjgstandings.json")
  .then((response) => response.json())
  .then((data) => {
    const placeholder = document.querySelector("#data-output");
    let out = "";

    if (data.standings && data.standings.length > 0) {
      for (const team of data.standings) {
        const isDivision =
          team.Team === "Central" ||
          team.Team === "East" ||
          team.Team === "North" ||
          team.Team === "West";

        const divisionClass = isDivision ? "division-row" : "";

        out += `
                <tr class="${divisionClass}">
                  <td>${team.Team ?? ""}</td>
                  <td>${team.W ?? ""}</td>
                  <td>${team.L ?? ""}</td>
                  <td>${team.T ?? ""}</td>
                  <td>${team.PTS ?? ""}</td>
                  <td>${team.RF ?? team.PF ?? ""}</td>
                  <td>${team.RA ?? team.PA ?? ""}</td>
                  <td>${team.DIFF ?? ""}</td>
                </tr>
              `;
      }
      placeholder.innerHTML = out;
    }

    // Last updated (standings)
    fetch("basketballjgstandings.json", { method: "HEAD" }).then((res) => {
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

//SENIOR BOYS

// ------------------ Standings ------------------
fetch("basketballsbstandings.json")
  .then((response) => response.json())
  .then((data) => {
    const placeholder = document.querySelector("#data-output");
    let out = "";

    if (data.standings && data.standings.length > 0) {
      for (const team of data.standings) {
        const isDivision =
          team.Team === "Central" ||
          team.Team === "East" ||
          team.Team === "North" ||
          team.Team === "West";

        const divisionClass = isDivision ? "division-row" : "";

        out += `
                <tr class="${divisionClass}">
                  <td>${team.Team ?? ""}</td>
                  <td>${team.W ?? ""}</td>
                  <td>${team.L ?? ""}</td>
                  <td>${team.T ?? ""}</td>
                  <td>${team.PTS ?? ""}</td>
                  <td>${team.RF ?? team.PF ?? ""}</td>
                  <td>${team.RA ?? team.PA ?? ""}</td>
                  <td>${team.DIFF ?? ""}</td>
                </tr>
              `;
      }
      placeholder.innerHTML = out;
    }

    // Last updated (standings)
    fetch("basketballsbstandings.json", { method: "HEAD" }).then((res) => {
      const lastModified = res.headers.get("last-modified");
      if (lastModified) {
        document.getElementById("last-updated").textContent =
          "Standings last updated: " + new Date(lastModified).toLocaleString();
      }
    });
  })
  .catch((error) => console.error("Error loading standings:", error));

// ------------------ Schedule ------------------
fetch("sbschedule.json")
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
        fetch("sbschedule.json", { method: "HEAD" })
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
fetch("basketballsgstandings.json")
  .then((response) => response.json())
  .then((data) => {
    const placeholder = document.querySelector("#data-output");
    let out = "";

    if (data.standings && data.standings.length > 0) {
      for (const team of data.standings) {
        const isDivision =
          team.Team === "Central" ||
          team.Team === "East" ||
          team.Team === "North" ||
          team.Team === "West";

        const divisionClass = isDivision ? "division-row" : "";

        out += `
                <tr class="${divisionClass}">
                  <td>${team.Team ?? ""}</td>
                  <td>${team.W ?? ""}</td>
                  <td>${team.L ?? ""}</td>
                  <td>${team.T ?? ""}</td>
                  <td>${team.PTS ?? ""}</td>
                  <td>${team.RF ?? team.PF ?? ""}</td>
                  <td>${team.RA ?? team.PA ?? ""}</td>
                  <td>${team.DIFF ?? ""}</td>
                </tr>
              `;
      }
      placeholder.innerHTML = out;
    }

    // Last updated (standings)
    fetch("basketballsgstandings.json", { method: "HEAD" }).then((res) => {
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
