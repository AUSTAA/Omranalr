document.addEventListener('DOMContentLoaded', () => {
    const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
    const suitSymbols = { hearts: '♥', spades: '♠', diamonds: '♦', clubs: '♣' };
    const values = ['A', '2', '3', '4', '5', '6', '7', 'Q', 'J', 'K'];
    let deck, player1Hand, player2Hand, middleCards, player1Collected, player2Collected;
    let player1Score = 0, player2Score = 0;
    let currentPlayer = 1;
    let roundOver = false;
    let totalRoundsPlayed = 0;

    function initializeGame() {
        deck = createDeck();
        shuffleDeck(deck);
        player1Hand = [];
        player2Hand = [];
        middleCards = [];
        player1Collected = [];
        player2Collected = [];
        dealInitialCards();
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
        renderCards('player1-hand', player1Hand, 1);
        renderCards('player2-hand', player2Hand, 2);
        renderCards('middle-cards', middleCards);
        document.getElementById('player1-score').textContent = player1Score;
        document.getElementById('player2-score').textContent = player2Score;
    }

    function renderCards(containerId, cards, player) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.suit}`;
            cardElement.innerHTML = `
                <div class="top-left">${card.value}<br>${suitSymbols[card.suit]}</div>
                <div class="symbol">${suitSymbols[card.suit]}</div>
                <div class="bottom-right">${card.value}<br>${suitSymbols[card.suit]}</div>
            `;
            cardElement.addEventListener('click', () => playCard(index, player));
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
        if (middleCards.length === 0) alert("شكبـّة!");

        if (player1Hand.length === 0 && player2Hand.length === 0) {
            dealNextCards();
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
        }

        updateDisplay();
    }

    function dealNextCards() {
        if (deck.length >= 6) {
            for (let i = 0; i < 3; i++) {
                player1Hand.push(deck.pop());
                player2Hand.push(deck.pop());
            }
        } else {
            calculatePoints();
        }
    }

    function calculatePoints() {
        let p1Dinari = player1Collected.filter(card => card.suit === 'diamonds').length;
        let p2Dinari = player2Collected.filter(card => card.suit === 'diamonds').length;

        if (p1Dinari > p2Dinari) player1Score++;
        if (p2Dinari > p1Dinari) player2Score++;

        if (p1Dinari === 8 || p1Dinari === 9) {
            player1Score += 10;
            player2Score = 0;
        }
        if (p2Dinari === 8 || p2Dinari === 9) {
            player2Score += 10;
            player1Score = 0;
        }
        if (p1Dinari === 10) {
            alert("كبووووط 🤣");
            player1Score = 61;
        }
        if (p2Dinari === 10) {
            alert("كبووووط 🤣");
            player2Score = 61;
        }

        if (player1Score >= 61 || player2Score >= 61) {
            alert(`الشوط انتهى! الفائز هو اللاعب ${player1Score >= 61 ? "1" : "2"} 🎉`);
            player1Score = 0;
            player2Score = 0;
        }

        initializeGame();
    }

    function cardValueToInt(value) {
        switch (value) {
            case 'A': return 1;
            case 'Q': return 8;
            case 'J': return 9;
            case 'K': return 10;
            default: return parseInt(value);
        }
    }

    function findSummingCombinations(cards, targetValue) {
        const results = [];
        function search(current, remaining, sum) {
            if (sum === targetValue) {
                results.push(current);
                return;
            }
            if (sum > targetValue || remaining.length === 0) return;
            for (let i = 0; i < remaining.length; i++) {
                search([...current, remaining[i]], remaining.slice(i + 1), sum + cardValueToInt(remaining[i].value));
            }
        }
        search([], cards, 0);
        return results;
    }

    document.getElementById('start-game').addEventListener('click', initializeGame);
    initializeGame();
});
