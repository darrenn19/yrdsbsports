fetch("baseballtier1standings.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data); // Log the JSON data to the console to ensure it's loaded

    let placeholder = document.querySelector("#data-output");
    let out = "";

    // Check if the 'standings' array exists and has data
    if (data.standings && data.standings.length > 0) {
      for (let product of data.standings) {
        // Check if the row is a division row
        let isDivision = false;
        if (
          product.Team === "Central" ||
          product.Team === "East" ||
          product.Team === "North" ||
          product.Team === "West"
        ) {
          isDivision = true; // Set to true if the team is a division
        }

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
  })
  .catch(function (error) {
    console.error("Error loading the data: ", error);
  });
