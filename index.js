const containerEl = document.getElementById("container")

let deckId = ""
let cards = new Array()
let player = {
  cards: new Array(),
  Aces: 0,
  value: 0
}
let dealer = {
  cards: new Array(),
  Aces: 0,
  value: 0
}
let chips = {
  current: 100,
  bet: 0,
  currentBet: 0
}

for (let i = 0; i < 6; i++) {
  document.getElementsByClassName("new-game")[i].addEventListener("click", renderBet)
}

async function startGame() {
  containerEl.innerHTML = `<h1 class="loading">loading...</h1>`
  const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
  const data = await response.json()
  deckId = data.deck_id
  for (let i=0; i < 4; i++){
    cards[i] = await drawCard()
  }
  player.cards.push(cards[0], cards[2])
  dealer.cards.push(cards[1], cards[3])
  player.value = updateValue(player.value, cards[0].value)
  player.value = updateValue(player.value, cards[2].value)
  dealer.value = updateValue(dealer.value, cards[3].value)
  renderGameplay()
}

async function drawCard() {
  const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
  data = await response.json()
  return data.cards[0]
}

function renderBet() {
  resetmodal()
  containerEl.innerHTML = `
  <h1>Place your bets</h1>
  <h1 id="current-bet">0</h1>
  <div class="bet-btns">
    <button class="add-btn bet-btn" value="1">1</button>
    <button class="add-btn bet-btn" value="5"">5</button>
    <button class="add-btn bet-btn" value="10">10</button>
    <button class="add-btn bet-btn" value="25">25</button>
  </div>
  <div class="bet-btns">
    <button class="minus-btn bet-btn" value="-1" disabled>-1</button>
    <button class="minus-btn bet-btn" value="-5" disabled>-5</button>
    <button class="minus-btn bet-btn" value="-10" disabled>-10</button>
    <button class="minus-btn bet-btn" value="-25" disabled>-25</button>
  </div>
  <button id="place-bet">Place Bet</button>
  `
  checkBalance()
  for (let i = 0; i < 8; i++) {
    document.getElementsByClassName("bet-btn")[i].addEventListener("click", updateBet)
  }
  document.getElementById("place-bet").addEventListener("click", placeBet)
}

function updateBet() {
  chips.currentBet += Number(this.value)
  chips.current -= Number(this.value)
  checkBalance()
  document.getElementById("current-bet").textContent = chips.currentBet
}

function placeBet() {
  chips.bet = chips.currentBet
  startGame()
}

function checkBalance() {
  // Checks if the add buttons should be disabled or enabled
  if (chips.current < 1) {
    for (let i = 0; i < 4; i++) {
      document.getElementsByClassName("add-btn")[i].disabled = true
    }
  } else if (chips.current < 5) {
      document.getElementsByClassName("add-btn")[0].disabled = false
      for (let i = 1; i < 4; i++) {
        document.getElementsByClassName("add-btn")[i].disabled = true
      }
  } else if (chips.current < 10) {
      for (let i = 2; i < 4; i++) {
        document.getElementsByClassName("add-btn")[i - 2].disabled = false
        document.getElementsByClassName("add-btn")[i].disabled = true
      }
  } else if (chips.current < 25) {
      for (let i = 0; i < 3; i++) {
        document.getElementsByClassName("add-btn")[i].disabled = false
      }
      document.getElementsByClassName("add-btn")[3].disabled = true
  } else {
      for (let i = 0; i < 4; i++) {
        document.getElementsByClassName("add-btn")[i].disabled = false
      }
  }

  // Checks if the minus buttons should be disabled or enabled
  if (chips.currentBet < 1) {
    for (let i = 0; i < 4; i++) {
      document.getElementsByClassName("minus-btn")[i].disabled = true
    }
  } else if (chips.currentBet < 5) {
      document.getElementsByClassName("minus-btn")[0].disabled = false
      for (let i = 1; i < 4; i++) {
        document.getElementsByClassName("minus-btn")[i].disabled = true
      }
  } else if (chips.currentBet < 10) {
      for (let i = 2; i < 4; i++) {
        document.getElementsByClassName("minus-btn")[i - 2].disabled = false
        document.getElementsByClassName("minus-btn")[i].disabled = true
      }
  } else if (chips.currentBet < 25) {
      for (let i = 0; i < 3; i++) {
        document.getElementsByClassName("minus-btn")[i].disabled = false
      }
      document.getElementsByClassName("minus-btn")[3].disabled = true
    } else {
      for (let i = 0; i < 4; i++) {
        document.getElementsByClassName("minus-btn")[i].disabled = false
      }
  }
}

function renderGameplay() {
  containerEl.innerHTML = `
  <p class="chips">Chips: <span id="current-chips">${chips.current}</span></p>
  <h4 class="count" id="dealer-count">0</h4>
  <div class="card-container" id="dealer-cards">
    <img class="hidden" src="./images/card-back.png">
    <img class="hidden" src="${cards[3].images.png}">
  </div>
  <div class="card-container" id="player-cards">
    <img class="hidden" src="${cards[0].images.png}">
    <img class="hidden" src="${cards[2].images.png}">
  </div>
  <h4 class="count" id="player-count">0</h4>
  <div class="action-btns">
    <button class="action-btn" id="hit" disabled>Hit</button>
    <button class="action-btn" id="double" disabled>Double</button>
    <button class="action-btn" id="stand" disabled>Stand</button>
  </div>
  <p>Bet: <span id="bet">${chips.bet}</span></p>
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
        document.getElementById("player-count").textContent = player.value
        document.getElementById("dealer-count").textContent = dealer.value

        // Checks if the player has blackjack and if the dealer has blackjack
        if (player.value === 21) {
          if (cards[1] + cards[3] === 21) {
            document.getElementById("dealer-cards").innerHTML = `
            <img src="${cards[1].image}">
            <img src="${cards[3].image}">
            `
            setTimeout(push, 1000)
            return
          } else {
            document.getElementById("dealer-cards").innerHTML = `
            <img src="${cards[1].image}">
            <img src="${cards[3].image}">
            `
            setTimeout(blackjack, 1000)
          }
        }
        
        // Checks if the dealer has blackjack
        if (cards[1] + cards[3] === 21) {
          document.getElementById("dealer-cards").innerHTML = `
          <img src="${cards[1].image}">
          <img src="${cards[3].image}">
          `
          setTimeout(lose, 1000)
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
  player.value = updateValue(player.value, card.value)
  document.getElementById("player-count").textContent = player.value
  checkValue(player.value)
}

async function double() {
  card = await drawCard()
  document.getElementById("player-cards").innerHTML += `<img src="${card.image}">`
  player.value = updateValue(player.value, card.value)
  document.getElementById("player-count").textContent = player.value
  if (player.value > 21) {
    checkValue(player.value)
  } else {
    dealersTurn()
  }
}

function resetmodal() {
  document.getElementById("busted").style.display = "none"
  document.getElementById("blackjack").style.display = "none"
  document.getElementById("win").style.display = "none"
  document.getElementById("push").style.display = "none"
  document.getElementById("lose").style.display = "none"
  document.getElementById("container").style.opacity = "1"
}

function busted() {
  document.getElementById("hit").disabled = true
  document.getElementById("stand").disabled = true
  document.getElementById("double").disabled = true
  document.getElementById("busted").style.display = "block"
  document.getElementById("container").style.opacity = ".35"
  player.value = 0
  dealer.value = 0
}

function blackjack() {
  document.getElementById("hit").disabled = true
  document.getElementById("stand").disabled = true
  document.getElementById("double").disabled = true
  document.getElementById("blackjack").style.display = "block"
  document.getElementById("container").style.opacity = ".35"
  player.value = 0
  dealer.value = 0
}

function win() {
  document.getElementById("hit").disabled = true
  document.getElementById("stand").disabled = true
  document.getElementById("double").disabled = true
  document.getElementById("win").style.display = "block"
  document.getElementById("container").style.opacity = ".35"
  player.value = 0
  dealer.value = 0
}

function push() {
  document.getElementById("hit").disabled = true
  document.getElementById("stand").disabled = true
  document.getElementById("double").disabled = true
  document.getElementById("push").style.display = "block"
  document.getElementById("container").style.opacity = ".35"
  player.value = 0
  dealer.value = 0
}

function lose() {
  document.getElementById("hit").disabled = true
  document.getElementById("stand").disabled = true
  document.getElementById("double").disabled = true
  document.getElementById("lose").style.display = "block"
  document.getElementById("container").style.opacity = ".35"
  player.value = 0
  dealer.value = 0
}

async function dealersTurn() {
  document.getElementById("hit").disabled = true
  document.getElementById("stand").disabled = true
  document.getElementById("double").disabled = true
  document.getElementById("dealer-cards").innerHTML = `
  <img src="${cards[1].image}">
  <img src="${cards[3].image}">
  `
  dealer.value = updateValue(dealer.value, cards[1].value)
  document.getElementById("dealer-count").textContent = dealer.value

  while (dealer.value < 18) {
    card = await drawCard()
    document.getElementById("dealer-cards").innerHTML += `<img src="${card.image}">`
    dealer.value = await updateValue(dealer.value, card.value)
    document.getElementById("dealer-count").textContent = dealer.value
  }

  if (dealer.value > 21) {
    setTimeout(win, 1000)
  } else {
    setTimeout(compareCounts, 1000)
  }
}

function compareCounts() {
  if (dealer.value > player.value) {
    lose()
  } else if (dealer.value < player.value) {
    win()
  } else {
    push()
  }
}

