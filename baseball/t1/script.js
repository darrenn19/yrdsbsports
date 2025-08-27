// Fetch the standings JSON
fetch("baseballtier1standings.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // Debug: see data in console

    let placeholder = document.querySelector("#data-output");
    let out = "";

    // Check if the 'standings' array exists and has data
    if (data.standings && data.standings.length > 0) {
      for (let product of data.standings) {
        // Check if the row is a division row
        let isDivision =
          product.Team === "Central" ||
          product.Team === "East" ||
          product.Team === "North" ||
          product.Team === "West";

        // Add the division class if it's a division row
        let divisionClass = isDivision ? "division-row" : "";

        out += `
          <tr class="${divisionClass}">
            <td>${product.Team}</td>
            <td>${product.W}</td>
            <td>${product.L}</td>
            <td>${product.T}</td>
            <td>${product.PTS}</td>
            <td>${product.RF}</td>
            <td>${product.RA}</td>
            <td>${product.DIFF}</td>
          </tr>
        `;
      }
      placeholder.innerHTML = out;
    } else {
      console.error("No standings data found.");
    }

    // Fetch the JSON headers separately to get last-modified timestamp
    fetch("baseballtier1standings.json", { method: "HEAD" })
      .then((res) => {
        let lastModified = res.headers.get("last-modified");
        if (lastModified) {
          document.getElementById("last-updated").textContent =
            "Last updated: " + new Date(lastModified).toLocaleString();
        }
      })
      .catch((err) =>
        console.error("Error fetching last-modified header:", err)
      );
  })
  .catch((error) => {
    console.error("Error loading the data: ", error);
  });
