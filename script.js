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
