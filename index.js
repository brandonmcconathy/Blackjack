const startEl = document.getElementById("start-game")
const containerEl = document.getElementById("container")

function startGame() {
  fetch("https://deckofcardsapi.com/api/deck/new/draw?count=4")
  .then(res => res.json())
  .then(data => {
    deckId = data.deck_id
    containerEl.innerHTML = `
    <h1>Dealer</h1>
    <div class="card-container">
      <img src="./images/card-back.png">
      <img src="${data.cards[1].images.png}">
    </div>
    <div class="card-container">
      <img src="${data.cards[0].images.png}">
      <img src="${data.cards[2].images.png}">
    </div>
    <h1>Player</h1>
    `
  })
}


startEl.addEventListener("click", startGame)