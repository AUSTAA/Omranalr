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
            cardElement.dataset.value = card.value; // Store value for easier access
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

        const cardValue = cardElement.dataset.value;
        const cardSuit = cardElement.classList[1];
        const playedCard = { value: cardValue, suit: cardSuit };

        // Find and remove the card from the player's hand
        const cardIndex = playerHand.findIndex(c => c.value === playedCard.value && c.suit === playedCard.suit);
        if (cardIndex === -1) return;
        playerHand.splice(cardIndex, 1);

        // Find matching cards in the middle
        const matchingCards = middleCards.filter(c => c.value === playedCard.value);
        const cardValueInt = cardValueToInt(playedCard.value);

        if (matchingCards.length > 0) {
            // If there are matching cards, choose them
            collectCards([playedCard, ...matchingCards], playerCollected, playerRevealed, middleCards);
        } else {
            // Otherwise, find summing cards
            const summingCards = findSummingCards(middleCards, cardValueInt);

            if (summingCards.length > 1) {
                // If multiple options, highlight choices for the player
                highlightChoices(summingCards, chosenCards => {
                    collectCards([playedCard, ...chosenCards], playerCollected, playerRevealed, middleCards);
                });
            } else if (summingCards.length === 1) {
                collectCards([playedCard, summingCards[0]], playerCollected, playerRevealed, middleCards);
            } else {
                // If no matching or summing cards, put the played card in the middle
                middleCards.push(playedCard);
                displayCards('middle-cards-container', middleCards);
                switchTurn();
            }
        }

        // Display updated hands
        displayCards('player1-cards', player1Hand);
        displayCards('player2-cards', player2Hand);

        // Deal new cards if both players are out of cards
        if (player1Hand.length === 0 && player2Hand.length === 0 && deck.length > 0) {
            dealNewCards();
            displayCards('player1-cards', player1Hand);
            displayCards('player2-cards', player2Hand);
        }

        // Check for end of round
        if (player1Hand.length === 0 && player2Hand.length === 0 && deck.length === 0) {
            endRound();
        }
    }

    function highlightChoices(choices, callback) {
        choices.forEach(choice => {
            const choiceElement = document.querySelector(`.card.${choice.suit}[data-value="${choice.value}"]`);
            if (choiceElement) {
                choiceElement.classList.add('choice-highlight');
                choiceElement.addEventListener('click', () => {
                    callback(choice);
                    document.querySelectorAll('.choice-highlight').forEach(card => {
                        card.classList.remove('choice-highlight');
                    });
                });
            }
        });
    }

    function collectCards(cards, playerCollected, playerRevealed, middleCards) {
        let isShkeba = false;

        cards.forEach(card => {
            const index = middleCards.findIndex(c => c.value === card.value && c.suit === card.suit);
            if (index > -1) {
                middleCards.splice(index, 1);
                playerCollected.push(card); // Add middle card to collected cards
            } else {
                playerCollected.push(card); // Add the played card to collected cards
            }
        });

        // Check if the player took the last card(s) from the middle
        if (middleCards.length === 0) {
            isShkeba = true;
            playerRevealed.push(cards[0]);  // Add the played card to revealed cards
            lastPlayerToTake = currentPlayer;
        }

        // Display updated collected cards
        displayCollectedCards(`player${currentPlayer}-collected`, playerCollected, playerRevealed);
        displayCards('middle-cards-container', middleCards);

        // Show "شكبـّة" message if it is a shkeba
        if (isShkeba) {
            alert('شكبـّة');
        }

        // Switch turn to the other player
        switchTurn();
    }

    function switchTurn() {    currentPlayer = (currentPlayer === 1) ? 2 : 1;
    document.getElementById('current-player').innerText = `Player ${currentPlayer}'s turn`;
}

function cardValueToInt(value) {
    switch (value) {
        case 'A': return 1;
        case 'J': return 11;
        case 'Q': return 12;
        case 'K': return 13;
        default: return parseInt(value);
    }
}

function findSummingCards(cards, targetValue) {
    const result = [];
    function findSubset(subset, startIndex) {
        const sum = subset.reduce((acc, card) => acc + cardValueToInt(card.value), 0);
        if (sum === targetValue) result.push([...subset]);
        if (sum >= targetValue || startIndex >= cards.length) return;

        for (let i = startIndex; i < cards.length; i++) {
            subset.push(cards[i]);
            findSubset(subset, i + 1);
            subset.pop();
        }
    }
    findSubset([], 0);
    return result;
}

function updateScores() {
    player1Score = calculateScore(player1Collected, player1Revealed);
    player2Score = calculateScore(player2Collected, player2Revealed);

    document.getElementById('player1-score').innerText = `Player 1: ${player1Score}`;
    document.getElementById('player2-score').innerText = `Player 2: ${player2Score}`;
}

function calculateScore(collectedCards, revealedCards) {
    let score = 0;
    collectedCards.forEach(card => {
        if (card.value === 'A') score += 1;
        else if (card.value === 'J') score += 1;
        else if (card.value === 'Q') score += 2;
        else if (card.value === 'K') score += 3;
        else if (card.suit === 'spades' && card.value === '10') score += 3;
    });
    score += revealedCards.length * 5;
    return score;
}

function endRound() {
    if (lastPlayerToTake !== null) {
        const remainingMiddleCards = [...middleCards];
        if (lastPlayerToTake === 1) {
            player1Collected.push(...remainingMiddleCards);
        } else {
            player2Collected.push(...remainingMiddleCards);
        }
    }

    updateScores();

    // Show end of round message and scores
    alert(`End of round! Scores:\nPlayer 1: ${player1Score}\nPlayer 2: ${player2Score}`);

    // Reset the game for a new round
    resetGame();
}

function resetGame() {
    deck = createDeck();
    deck = shuffleDeck(deck);

    player1Hand.length = 0;
    player2Hand.length = 0;
    middleCards.length = 0;
    player1Collected.length = 0;
    player2Collected.length = 0;
    player1Revealed.length = 0;
    player2Revealed.length = 0;

    currentPlayer = 1;
    lastPlayerToTake = null;

    dealInitialCards();

      // Display updated cards
    displayCards('player1-cards', player1Hand);
    displayCards('player2-cards', player2Hand);
    displayCards('middle-cards-container', middleCards);
    displayCollectedCards('player1-collected', player1Collected, player1Revealed);
    displayCollectedCards('player2-collected', player2Collected, player2Revealed);
    updateScores();
}

});
