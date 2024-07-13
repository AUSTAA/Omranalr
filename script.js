document.addEventListener('DOMContentLoaded', () => {
    const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
    const suitSymbols = {
        hearts: '♥',
        spades: '♠',
        diamonds: '♦',
        clubs: '♣'
    };
    const values = ['A', '2', '3', '4', '5', '6', '7', 'Q', 'J', 'K'];
    let deck = createDeck();
    deck = shuffleDeck(deck);

    const player1Hand = [];
    const player2Hand = [];
    const middleCards = [];
    const player1Collected = [];
    const player2Collected = [];
    const player1Revealed = [];
    const player2Revealed = [];

    let currentPlayer = 1;
    let lastPlayerToTake = null;
    let player1Score = 0;
    let player2Score = 0;

    // Initialize hands and middle cards
    dealInitialCards();

    // Display cards
    displayCards('player1-cards', player1Hand);
    displayCards('player2-cards', player2Hand);
    displayCards('middle-cards-container', middleCards);
    displayCollectedCards('player1-collected', player1Collected, player1Revealed);
    displayCollectedCards('player2-collected', player2Collected, player2Revealed);
    updateScores();

    // Event listeners for playing cards
    document.getElementById('player1-cards').addEventListener('click', event => {
        if (currentPlayer === 1) playCard(event, player1Hand, player1Collected, player1Revealed, middleCards);
    });
    document.getElementById('player2-cards').addEventListener('click', event => {
        if (currentPlayer === 2) playCard(event, player2Hand, player2Collected, player2Revealed, middleCards);
    });

    function createDeck() {
        const deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ value, suit });
            }
        }
        return deck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
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

    function dealNewCards() {
        for (let i = 0; i < 3; i++) {
            if (deck.length > 0) player1Hand.push(deck.pop());
            if (deck.length > 0) player2Hand.push(deck.pop());
        }
    }

    function displayCards(elementId, cards) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.suit}`;
            cardElement.innerHTML = `
                <div class="top-left">${card.value}<br>${suitSymbols[card.suit]}</div>
                <div class="symbol">${suitSymbols[card.suit]}</div>
                <div class="bottom-right">${card.value}<br>${suitSymbols[card.suit]}</div>
            `;
            container.appendChild(cardElement);
        });
    }

    function displayCollectedCards(elementId, cards, revealedCards) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card collected-card';
            cardElement.style.top = `${index * 2}px`;
            cardElement.style.left = `${index * 2}px`;
            container.appendChild(cardElement);
        });

        // Display revealed cards (partial)
        revealedCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.suit} revealed-card`;
            cardElement.innerHTML = `
                <div class="top-left">${card.value}<br>${suitSymbols[card.suit]}</div>
                <div class="symbol">${suitSymbols[card.suit]}</div>
                <div class="bottom-right">${card.value}<br>${suitSymbols[card.suit]}</div>
            `;
            cardElement.style.top = `${index * 2}px`;
            cardElement.style.left = `${index * 2}px`;
            cardElement.style.opacity = '0.5'; // Make it partially visible
            container.appendChild(cardElement);
        });
    }

    function playCard(event, playerHand, playerCollected, playerRevealed, middleCards) {
        const cardElement = event.target.closest('.card');
        if (!cardElement) return;

        const cardValue = cardElement.querySelector('.top-left').textContent[0];
        const cardSuit = cardElement.classList[1];
        const card = { value: cardValue, suit: cardSuit };

        // Find and remove the card from the player's hand
        const cardIndex = playerHand.findIndex(c => c.value === card.value && c.suit === card.suit);
        if (cardIndex === -1) return;
        playerHand.splice(cardIndex, 1);

        // Find matching cards in the middle
        const matchingCards = middleCards.filter(c => c.value === card.value);
        const cardValueInt = cardValueToInt(card.value);

        let chosenCards = [];
        if (matchingCards.length > 0) {
            // If there are matching cards, choose them
            chosenCards = matchingCards;
        } else {
            // Otherwise, find summing cards
            chosenCards = findSummingCards(middleCards, cardValueInt);
        }

        let isShkeba = false;
        if (chosenCards.length > 0) {
            chosenCards.forEach(mc => {
                const index = middleCards.findIndex(c => c.value === mc.value && c.suit === mc.suit);
                if (index > -1) middleCards.splice(index, 1);
                playerCollected.push(mc); // Add middle card to collected cards
            });

            // Add the played card to the player's collected cards
            playerCollected.push(card);

            // Check if the player took the last card(s) from the middle
            if (middleCards.length === 0) {
                isShkeba = true;
                playerRevealed.push(card);  // Add the played card to revealed cards
                lastPlayerToTake = currentPlayer;
            }

            // Display updated collected cards
            displayCollectedCards(`player${currentPlayer}-collected`, playerCollected, playerRevealed);
        } else {
            // If no matching or summing cards, put the played card in the middle
            middleCards.push(card);
        }

        // Switch turn to the other player
        currentPlayer = currentPlayer === 1 ? 2 : 1;

        // Display updated middle cards
        displayCards('middle-cards-container', middleCards);

        // Display updated hands
        displayCards('player1-cards', player1Hand);
        displayCards('player2-cards', player2Hand);

        // Deal new cards if both players are out of cards
        if (player1Hand.length === 0 && player2Hand.length === 0 && deck.length > 0) {
            dealNewCards();
            displayCards('player1-cards', player1Hand);
            displayCards('player2-cards', player2Hand);
        }

        // Show "شكبـّة" message if it is a shkeba
        if (isShkeba) {
            alert('شكبـّة');
        }

        // Check for end of round
        if (player1Hand.length === 0 && player2Hand.length === 0 && deck.length === 0) {
            endRound();
        }
    }

        function cardValueToInt(value) {
        if (value === 'A') return 1;
        if (value === 'J') return 11;
        if (value === 'Q') return 12;
        if (value === 'K') return 13;
        return parseInt(value);
    }

    function findSummingCards(cards, targetValue) {
        let result = [];
        function backtrack(start, tempSum, tempCards) {
            if (tempSum === targetValue) {
                result = tempCards.slice();
                return true;
            }
            if (tempSum > targetValue) return false;

            for (let i = start; i < cards.length; i++) {
                tempCards.push(cards[i]);
                if (backtrack(i + 1, tempSum + cardValueToInt(cards[i].value), tempCards)) {
                    return true;
                }
                tempCards.pop();
            }
            return false;
        }
        backtrack(0, 0, []);
        return result;
    }

    function updateScores() {
        player1Score = calculateScore(player1Collected, player1Revealed);
        player2Score = calculateScore(player2Collected, player2Revealed);
        document.getElementById('player1-score').textContent = `Player 1 Score: ${player1Score}`;
        document.getElementById('player2-score').textContent = `Player 2 Score: ${player2Score}`;
    }

    function calculateScore(collected, revealed) {
        let score = 0;
        collected.forEach(card => {
            if (card.value === 'A') score += 1;
            if (card.value === 'J') score += 1;
            if (card.value === 'Q') score += 1;
            if (card.value === 'K') score += 1;
        });
        score += revealed.length * 10;
        return score;
    }

    function endRound() {
        // Handle end of round logic, like updating scores, resetting hands, etc.
        updateScores();
        alert(`Round over! Player 1 Score: ${player1Score}, Player 2 Score: ${player2Score}`);

        // Reset hands and middle cards for the next round
        player1Hand.length = 0;
        player2Hand.length = 0;
        middleCards.length = 0;

        // Reset collected and revealed cards
        player1Collected.length = 0;
        player2Collected.length = 0;
        player1Revealed.length = 0;
        player2Revealed.length = 0;

        // Shuffle and deal new cards
        deck = shuffleDeck(createDeck());
        dealInitialCards();

        // Display cards again
        displayCards('player1-cards', player1Hand);
        displayCards('player2-cards', player2Hand);
        displayCards('middle-cards-container', middleCards);
        displayCollectedCards('player1-collected', player1Collected, player1Revealed);
        displayCollectedCards('player2-collected', player2Collected, player2Revealed);
    }
});
