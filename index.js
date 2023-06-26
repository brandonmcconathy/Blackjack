const startEl = document.getElementById("start-game")
const containerEl = document.getElementById("container")
const bustedEl = document.getElementById("busted-btn")
const blackjackEl = document.getElementById("blackjack-btn")
const winEl = document.getElementById("win-btn")
const pushEl = document.getElementById("push-btn")
const loseEl = document.getElementById("lose-btn")
let deckId = ""
let cards = new Array()
let playerValue = 0
let dealerValue = 0

startEl.addEventListener("click", gameplay)
bustedEl.addEventListener("click", gameplay)
blackjackEl.addEventListener("click", gameplay)
winEl.addEventListener("click", gameplay)
pushEl.addEventListener("click", gameplay)
loseEl.addEventListener("click", gameplay)

function gameplay() {
  resetmodal()
  startGame()
}

async function startGame() {
  containerEl.innerHTML = "<h1>loading...</h1>"
  const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
  const data = await response.json()
  deckId = data.deck_id
  for (let i=0; i < 4; i++){
    cards[i] = await drawCard()
  }
  renderGameplay()
  playerValue = updateValue(playerValue, cards[0].value)
  playerValue = updateValue(playerValue, cards[2].value)
  dealerValue = updateValue(dealerValue, cards[3].value)
  console.log(cards)
}

async function drawCard() {
  const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
  data = await response.json()
  return data.cards[0]
}

function renderGameplay() {
  containerEl.innerHTML = `
  <h1>Dealer</h1>
  <h4 id="dealer-count">0</h4>
  <div class="card-container" id="dealer-cards">
    <img class="hidden" src="./images/card-back.png">
    <img class="hidden" src="${cards[3].images.png}">
  </div>
  <div class="card-container" id="player-cards">
    <img class="hidden" src="${cards[0].images.png}">
    <img class="hidden" src="${cards[2].images.png}">
  </div>
  <h4 id="player-count">0</h4>
  <div class="action-btns">
    <button class="action-btn" id="hit" disabled>Hit</button>
    <button class="action-btn" id="stand" disabled>Stand</button>
    <button class="action-btn" id="double" disabled>Double</button>
  </div>
  <h1>Player</h1>
  `

  const playerEl = document.getElementById("player-cards")
  const dealerEl = document.getElementById("dealer-cards")

  // Deals the starting hands with a delay between each card
  setTimeout(() => {document.getElementsByClassName("hidden")[2].style.visibility = "visible"
    setTimeout(() => {document.getElementsByClassName("hidden")[0].style.visibility = "visible"
      setTimeout(() => {document.getElementsByClassName("hidden")[3].style.visibility = "visible"
        setTimeout(() => {document.getElementsByClassName("hidden")[1].style.visibility = "visible"
        document.getElementById("hit").disabled = false
        document.getElementById("stand").disabled = false
        document.getElementById("double").disabled = false
        document.getElementById("player-count").textContent = playerValue
        document.getElementById("dealer-count").textContent = dealerValue
        if (playerValue === 21) {
          blackjack()
        }
        }, 700)
      }, 700)
    }, 700)
  }, 700)

  document.getElementById("hit").addEventListener("click", hit)
  document.getElementById("stand").addEventListener("click", dealersTurn)
  document.getElementById("double").addEventListener("click", double)
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
    document.getElementById("hit").disabled = true
    document.getElementById("stand").disabled = true
    document.getElementById("double").disabled = true
    setTimeout(busted, 1000)
  }
}

async function hit() {
  document.getElementById("double").disabled = true
  card = await drawCard()
  document.getElementById("player-cards").innerHTML += `<img src="${card.image}">`
  playerValue = updateValue(playerValue, card.value)
  document.getElementById("player-count").textContent = playerValue
  checkValue(playerValue)
}

async function double() {
  card = await drawCard()
  document.getElementById("player-cards").innerHTML += `<img src="${card.image}">`
  playerValue = updateValue(playerValue, card.value)
  document.getElementById("player-count").textContent = playerValue
  checkValue(playerValue)
  dealersTurn()
}

function resetmodal() {
  document.getElementById("busted").style.display = "none"
  document.getElementById("blackjack").style.display = "none"
  document.getElementById("win").style.display = "none"
  document.getElementById("push").style.display = "none"
  document.getElementById("lose").style.display = "none"
  document.getElementById("container").style.filter = ""
}

function busted() {
  document.getElementById("hit").disabled = true
  document.getElementById("stand").disabled = true
  document.getElementById("double").disabled = true
  document.getElementById("busted").style.display = "block"
  document.getElementById("container").style.filter = "blur(2.5px)"
  playerValue = 0
  dealerValue = 0
}

function blackjack() {
  document.getElementById("hit").disabled = true
  document.getElementById("stand").disabled = true
  document.getElementById("double").disabled = true
  document.getElementById("blackjack").style.display = "block"
  document.getElementById("container").style.filter = "blur(2.5px)"
  playerValue = 0
  dealerValue = 0
}

function win() {
  document.getElementById("hit").disabled = true
  document.getElementById("stand").disabled = true
  document.getElementById("double").disabled = true
  document.getElementById("win").style.display = "block"
  document.getElementById("container").style.filter = "blur(2.5px)"
  playerValue = 0
  dealerValue = 0
}

function push() {
  document.getElementById("hit").disabled = true
  document.getElementById("stand").disabled = true
  document.getElementById("double").disabled = true
  document.getElementById("push").style.display = "block"
  document.getElementById("container").style.filter = "blur(2.5px)"
  playerValue = 0
  dealerValue = 0
}

function lose() {
  document.getElementById("hit").disabled = true
  document.getElementById("stand").disabled = true
  document.getElementById("double").disabled = true
  document.getElementById("lose").style.display = "block"
  document.getElementById("container").style.filter = "blur(2.5px)"
  playerValue = 0
  dealerValue = 0
}

async function dealersTurn() {
  document.getElementById("hit").disabled = true
  document.getElementById("stand").disabled = true
  document.getElementById("double").disabled = true
  document.getElementById("dealer-cards").innerHTML = `
  <img src="${cards[1].image}">
  <img src="${cards[3].image}">
  `
  dealerValue = updateValue(dealerValue, cards[1].value)
  document.getElementById("dealer-count").textContent = dealerValue

  while (dealerValue < 18) {
    card = await drawCard()
    document.getElementById("dealer-cards").innerHTML += `<img src="${card.image}">`
    dealerValue = await updateValue(dealerValue, card.value)
    document.getElementById("dealer-count").textContent = dealerValue
  }

  if (dealerValue > 21) {
    setTimeout(win, 1000)
  } else {
    setTimeout(compareCounts, 1000)
  }
}

function compareCounts() {
  if (dealerValue > playerValue) {
    lose()
  } else if (dealerValue < playerValue) {
    win()
  } else {
    push()
  }
}

