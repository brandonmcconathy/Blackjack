const startEl = document.getElementById("start-game")
const containerEl = document.getElementById("container")
const newEl = document.getElementById("new-hand")
let deckId = ""
let cards = new Array()
let playerValue = 0
let dealerValue = 0

startEl.addEventListener("click", gameplay)
newEl.addEventListener("click", gameplay)

function gameplay() {
  resetmodal()
  startGame()

  // checks if player has 21
  if (playerValue === 21) {
    win()
    return
  }

}

async function startGame() {
  containerEl.innerHTML = "<h1>loading...</h1>"
  const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
  const data = await response.json()
  deckId = data.deck_id
  for (let i=0; i < 4; i++){
    cards[i] = await drawCard()
  }
  renderGameplay(cards)
  playerValue = updateValue(playerValue, cards[0].value)
  dealerValue = updateValue(dealerValue, cards[1].value)
  playerValue = updateValue(playerValue, cards[2].value)
  dealerValue = updateValue(dealerValue, cards[3].value)
  console.log(cards)
}

async function drawCard() {
  const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
  data = await response.json()
  return data.cards[0]
}

function renderGameplay(cards) {
  containerEl.innerHTML = `
  <h1>Dealer</h1>
  <div class="card-container" id="dealer-cards">
    <img class="hidden" src="${cards[0].images.png}">
    <img class="hidden" src="${cards[0].images.png}">
  </div>
  <div class="card-container" id="player-cards">
    <img class="hidden" src="${cards[0].images.png}">
    <img class="hidden" src="${cards[0].images.png}">
  </div>
  <h4 id="count">0</h4>
  <div class="action-btns">
    <button class="action-btn" id="hit" disabled>Hit</button>
    <button class="action-btn" id="stand" disabled>Stand</button>
  </div>
  <h1>Player</h1>
  `

  const playerEl = document.getElementById("player-cards")
  const dealerEl = document.getElementById("dealer-cards")

  // Deals the starting hands with a delay between each card
  setTimeout(() => {playerEl.innerHTML = `<img src="${cards[0].image}">`
    setTimeout(() => {dealerEl.innerHTML = `<img src="./images/card-back.png">`
      setTimeout(() => {playerEl.innerHTML += `<img src="${cards[2].image}">`
        setTimeout(() => {dealerEl.innerHTML += `<img src="${cards[3].image}">`
        document.getElementById("hit").disabled = false
        document.getElementById("stand").disabled = false
        document.getElementById("count").textContent = playerValue
        }, 700)
      }, 700)
    }, 700)
  }, 700)

  document.getElementById("hit").addEventListener("click", hit)
  document.getElementById("stand").addEventListener("click", hit)
}

function updateValue(value, card) {
  if (card.length > 3) {
    value += 10
  } else if (card.length > 2) {
    value += 11
    if (value > 21) {
      value -= 10
    }
  } else {
    value += Number(card)
  }
  return value
}

function checkValue(value) {
  if (value > 21) {
    busted()
  }
}

async function hit() {
  card = await drawCard()
  document.getElementById("player-cards").innerHTML += `<img src="${card.image}">`
  playerValue = updateValue(playerValue, card.value)
  document.getElementById("count").textContent = playerValue
  checkValue(playerValue)
}

function resetmodal() {
  document.getElementById("busted").style.display = "none"
  document.getElementById("container").style.filter = ""
}

function busted() {
  document.getElementById("hit").disabled = true
  document.getElementById("stand").disabled = true
  document.getElementById("busted").style.display = "block"
  document.getElementById("container").style.filter = "blur(2.5px)"
  playerValue = 0
}
