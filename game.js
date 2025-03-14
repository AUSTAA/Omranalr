document.addEventListener("DOMContentLoaded", () => {
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

    function playCard(cardIndex, player) {
        if (roundOver) return;

        if ((currentPlayer === 1 && player !== 1) || (currentPlayer === 2 && player !== 2)) {
            alert("ليس دورك!");
            return;
        }

        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const collectedCards = currentPlayer === 1 ? player1Collected : player2Collected;

        if (cardIndex < 0 || cardIndex >= currentHand.length) return;

        const card = currentHand[cardIndex];
        const cardValue = cardValueToInt(card.value);

        const matchingCardIndex = middleCards.findIndex(c => cardValueToInt(c.value) === cardValue);

        if (matchingCardIndex !== -1) {
            collectedCards.push(middleCards.splice(matchingCardIndex, 1)[0]);
            collectedCards.push(card);
        } else {
            const combinations = findSummingCombinations(middleCards, cardValue);
            if (combinations.length > 0) {
                combinations[0].forEach(match => {
                    const index = middleCards.findIndex(c => c.value === match.value && c.suit === match.suit);
                    if (index !== -1) {
                        collectedCards.push(middleCards.splice(index, 1)[0]);
                    }
                });
                collectedCards.push(card);
            } else {
                middleCards.push(card);
            }
        }

        currentHand.splice(cardIndex, 1);

        if (middleCards.length === 0) {
            const lastCardValue = cardValueToInt(card.value);
            if (currentPlayer === 1) player1Score += lastCardValue;
            else player2Score += lastCardValue;
            alert("شكبـّة! + " + lastCardValue + " نقطة");
        }

        checkSpecialRules(collectedCards);

        if (player1Hand.length === 0 && player2Hand.length === 0) {
            dealNextCards();
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
        }

        updateDisplay();
    }

    function checkSpecialRules(collectedCards) {
        let count7 = collectedCards.filter(c => c.value === "7").length;
        let count6 = collectedCards.filter(c => c.value === "6").length;
        let countDinari7 = collectedCards.filter(c => c.value === "7" && c.suit === "diamonds").length;
        let countDinari = collectedCards.filter(c => c.suit === "diamonds").length;

        if (count7 >= 3 || (count7 >= 2 && count6 >= 3)) {
            alert("برميلة! +1 نقطة");
            if (currentPlayer === 1) player1Score++;
            else player2Score++;
        }

        if (countDinari7 > 0) {
            alert("🐍 الحية! +1 نقطة");
            if (currentPlayer === 1) player1Score++;
            else player2Score++;
        }

        if (countDinari >= 5) {
            alert("الديناري باجي! النقاط ملغية");
            player1Score = 0;
            player2Score = 0;
        }
    }

    function dealNextCards() {
        if (deck.length >= 6) {
            for (let i = 0; i < 3; i++) {
                player1Hand.push(deck.pop());
                player2Hand.push(deck.pop());
            }
        } else {
            endRound();
        }
    }

    function cardValueToInt(value) {
        return value === "A" ? 1 : value === "Q" ? 8 : value === "J" ? 9 : value === "K" ? 10 : parseInt(value);
    }

    document.getElementById("start-game").addEventListener("click", initializeGame);
    initializeGame();
});