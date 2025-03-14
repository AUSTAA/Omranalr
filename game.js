const suits = ["hearts", "spades", "diamonds", "clubs"];
const suitSymbols = { hearts: "♥", spades: "♠", diamonds: "♦", clubs: "♣" };
const values = ["A", "2", "3", "4", "5", "6", "7", "Q", "J", "K"];
let deck, player1Hand, player2Hand, middleCards, player1Collected, player2Collected;
let player1Score = 0, player2Score = 0;
let currentPlayer = 1;
let roundOver = false;

function initializeGame() {
    deck = createDeck();
    shuffleDeck(deck);
    player1Hand = [];
    player2Hand = [];
    middleCards = [];
    player1Collected = [];
    player2Collected = [];
    dealInitialCards();
    currentPlayer = 1;
    roundOver = false;
    updateDisplay();
}

function createDeck() {
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealInitialCards() {
    for (let i = 0; i < 3; i++) {
        player1Hand.push(deck.pop());
        player2Hand.push(deck.pop());
    }
    for (let i = 0; i < 4; i++) {
        middleCards.push(deck.pop());
    }
}

function updateDisplay() {
    renderCards("player1-hand", player1Hand, 1);
    renderCards("player2-hand", player2Hand, 2);
    renderCards("middle-cards", middleCards);

    document.getElementById("player1-score").textContent = player1Score;
    document.getElementById("player2-score").textContent = player2Score;
}

function renderCards(containerId, cards, player) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    cards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.className = `card ${card.suit}`;
        cardElement.innerHTML = `
            <div class="top-left">${card.value}<br>${suitSymbols[card.suit]}</div>
            <div class="symbol">${suitSymbols[card.suit]}</div>
            <div class="bottom-right">${card.value}<br>${suitSymbols[card.suit]}</div>
        `;
        cardElement.addEventListener("click", () => playCard(index, player));
        container.appendChild(cardElement);
    });
}