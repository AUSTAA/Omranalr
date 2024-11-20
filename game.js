document.addEventListener('DOMContentLoaded', () => {
    const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    let deck = [];
    let player1Hand = [];
    let player2Hand = [];
    let middleCards = [];
    let player1Score = 0;
    let player2Score = 0;
    let currentPlayer = 1;

    const player1HandContainer = document.getElementById('player1-hand');
    const player2HandContainer = document.getElementById('player2-hand');
    const middleContainer = document.getElementById('middle-cards-container');
    const startGameButton = document.getElementById('start-game');
    const player1ScoreDisplay = document.getElementById('player1-score');
    const player2ScoreDisplay = document.getElementById('player2-score');

    // Initialize the deck
    function createDeck() {
        deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }
        shuffleDeck(deck);
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function dealInitialCards() {
        player1Hand = deck.splice(0, 3);
        player2Hand = deck.splice(0, 3);
        middleCards = deck.splice(0, 4);
        updateDisplay();
    }

    function updateDisplay() {
        renderCards(player1HandContainer, player1Hand);
        renderCards(player2HandContainer, player2Hand);
        renderCards(middleContainer, middleCards);
        player1ScoreDisplay.textContent = player1Score;
        player2ScoreDisplay.textContent = player2Score;
    }

    function renderCards(container, cards) {
        container.innerHTML = '';
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.suit}`;
            cardElement.textContent = card.value;
            cardElement.addEventListener('click', () => handleCardPlay(card));
            container.appendChild(cardElement);
        });
    }

    function handleCardPlay(card) {
        if ((currentPlayer === 1 && player1Hand.includes(card)) || 
            (currentPlayer === 2 && player2Hand.includes(card))) {
            playCard(card);
        }
    }

    function playCard(card) {
        const playerHand = currentPlayer === 1 ? player1Hand : player2Hand;

        // Remove card from player's hand
        const cardIndex = playerHand.findIndex(c => c.value === card.value && c.suit === card.suit);
        if (cardIndex !== -1) {
            playerHand.splice(cardIndex, 1);
        }

        // Match logic
        const matchingCards = middleCards.filter(mc => mc.value === card.value);
        if (matchingCards.length > 0) {
            // Take the matching card
            matchingCards.forEach(mc => {
                middleCards.splice(middleCards.indexOf(mc), 1);
            });
            if (currentPlayer === 1) player1Score++; else player2Score++;
        } else {
            middleCards.push(card);
        }

        // Switch turn
        currentPlayer = currentPlayer === 1 ? 2 : 1;

        // Deal new cards if hands are empty
        if (player1Hand.length === 0 && player2Hand.length === 0 && deck.length > 0) {
            dealInitialCards();
        }

        updateDisplay();
    }

    // Start the game
    startGameButton.addEventListener('click', () => {
        createDeck();
        dealInitialCards();
    });
});
