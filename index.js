const startEl = document.getElementById("start-game")
const containerEl = document.getElementById("container")

async function startGame() {
  containerEl.innerHTML = "<h1>loading...</h1>"
  const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
  const data = await response.json()
  const deckId = data.deck_id
  let cards = new Array()
  for (let i=0; i < 4; i++){
    cards[i] = await drawCard(deckId)
  }
  renderGameplay(cards)
  console.log(cards)
}

async function drawCard(deckId) {
  const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
  data = await response.json()
  return data.cards[0]
}

function renderGameplay(cards) {
  containerEl.innerHTML = `
  <h1>Dealer</h1>
  <div class="card-container" id="dealer-cards"></div>
  <div class="card-container" id="player-cards"></div>
  <h1>Player</h1>
  `

  playerEl = document.getElementById("player-cards")
  dealerEl = document.getElementById("dealer-cards")

  // Deals the starting hands out with a delay
  setTimeout(() => {playerEl.innerHTML = `<img src="${cards[0].images.png}">`
    setTimeout(() => {dealerEl.innerHTML = `<img src="./images/card-back.png">`
      setTimeout(() => {playerEl.innerHTML += `<img src="${cards[2].images.png}">`
        setTimeout(() => {dealerEl.innerHTML += `<img src="${cards[3].images.png}">`
        }, 700)
      }, 700)
    }, 700)
  }, 700)
}

startEl.addEventListener("click", startGame)