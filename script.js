const searchBar = document.getElementById("searchBar");
const sportsGrid = document.getElementById("sportsGrid");
const cards = sportsGrid.getElementsByClassName("card");
const wrestlingCard = document.querySelector(".wrestling-wrapper"); // grab Wrestling

searchBar.addEventListener("keyup", function () {
  const query = searchBar.value.toLowerCase();

  // loop over grid cards
  for (let card of cards) {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(query) ? "" : "none";
  }

  // check Wrestling separately
  if (wrestlingCard) {
    const text = wrestlingCard.innerText.toLowerCase();
    wrestlingCard.style.display = text.includes(query) ? "" : "none";
  }
});

//SCHOOL SELECT FIX
// --- School Selection Handling ---
const schoolSelect = document.getElementById("schoolSelect");

// Load saved school from localStorage
const savedSchool = localStorage.getItem("selectedSchool");
if (savedSchool) {
  schoolSelect.value = savedSchool;
}

// Save school choice whenever changed
schoolSelect.addEventListener("change", () => {
  localStorage.setItem("selectedSchool", schoolSelect.value);
  highlightSchool();
});

// Function to highlight school in standings/schedule
function highlightSchool() {
  const selected = localStorage.getItem("selectedSchool");
  if (!selected) return;

  // Go through all table cells
  document.querySelectorAll("td").forEach((cell) => {
    // Reset previous highlighting
    cell.classList.remove("highlight-school");

    if (cell.textContent.trim() === selected) {
      cell.classList.add("highlight-school");
    }
  });
}

// Run highlight on page load
highlightSchool();
