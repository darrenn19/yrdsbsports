const searchBar = document.getElementById("searchBar");
const sportsGrid = document.getElementById("sportsGrid");
const cards = sportsGrid.getElementsByClassName("card");

searchBar.addEventListener("keyup", function () {
  const query = searchBar.value.toLowerCase();

  for (let card of cards) {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(query) ? "" : "none";
  }
});
