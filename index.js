const startEl = document.getElementById("start-game")
const containerEl = document.getElementById("container")

async function startGame() {
  const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
  const data = await response.json()
  const deckId = data.deck_id
  let cards = new Array()
  for (let i=0; i < 4; i++){
    cards[i] = await drawCard(deckId)
  }
  console.log(cards)
}

async function drawCard(deckId) {
  const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
  data = await response.json()
  return data.cards[0]
}


startEl.addEventListener("click", startGame)



// Use setTimeout to deal out the cards

// containerEl.innerHTML = `
// <h1>Dealer</h1>
// <div class="card-container">
//   <img src="./images/card-back.png">
//   <img src="${data.cards[1].images.png}">
// </div>
// <div class="card-container">
//   <img src="${data.cards[0].images.png}">
//   <img src="${data.cards[2].images.png}">
// </div>
// <h1>Player</h1>
// `