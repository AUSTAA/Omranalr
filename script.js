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

        if (chosenCards.length > 0) {
            highlightCards(chosenCards);
            let selectedSet = false;
            chosenCards.forEach(set => {
                set.forEach(card => {
                    card.element.addEventListener('click', () => {
                        if (!selectedSet) {
                            selectedSet = true;
                            collectCards(set, playerCollected, card);
                            displayCollectedCards(`player${currentPlayer}-collected`, playerCollected, playerRevealed);
                            finalizeMove(card, playerHand, middleCards);
                        }
                    });
                });
            });
        } else {
            // If no matching or summing cards, put the played card in the middle
            middleCards.push(card);
            finalizeMove(card, playerHand, middleCards);
        }
    }

    function highlightCards(cards) {
        cards.forEach(set => {
            set.forEach(card => {
                card.element.classList.add('highlight');
            });
        });
    }

    function unhighlightCards(cards) {
        cards.forEach(set => {
            set.forEach(card => {
                card.element.classList.remove('highlight');
            });
        });
    }

    function collectCards(cards, playerCollected, playedCard) {
        cards.forEach(card => {
            const index = middleCards.findIndex(c => c.value === card.value && c.suit === card.suit);
            if (index > -1) middleCards.splice(index, 1);
            playerCollected.push(card); // Add middle card to collected cards
        });

        // Add the played card to the player's collected cards
        playerCollected.push(playedCard);
    }

    function finalizeMove(card, playerHand, middleCards) {
        unhighlightCards(middleCards);
        displayCards('middle-cards-container', middleCards);
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        displayCards('player1-cards', player1Hand);
        displayCards('player2-cards', player2Hand);
        if (player1Hand.length === 0 && player2Hand.length === 0 && deck.length > 0) {
            dealNewCards();
            displayCards('player1-cards', player1Hand);
            displayCards('player2-cards', player2Hand);
        }
        if (middleCards.length === 0) {
            alert('شكبـّة');
        }
        if (player1Hand.length === 0 && player2Hand.length === 0 && deck.length === 0) {
            endRound();
        }
    }

    function cardValueToInt(value) {
        switch (value) {
            case 'A': return 1;
            case '2': return 2;
            case '3': return 3;
            case '4': return 4;
            case '5': return 5;
            case '6': return 6;
            case '7': return 7;
            case 'Q': return 8;
            case 'J': return 9;
            case 'K': return 10;
        default: return parseInt(value, 10);
    }
}

function findSummingCards(cards, targetValue) {
    const result = [];
    const subset = (arr, sum, index = 0, current = []) => {
        if (sum === 0) {
            result.push(current);
            return;
        }
        if (index >= arr.length || sum < 0) return;
        subset(arr, sum - cardValueToInt(arr[index].value), index + 1, [...current, arr[index]]);
        subset(arr, sum, index + 1, current);
    };
    subset(cards, targetValue);
    return result;
}

function updateScores() {
    player1Score = calculateScore(player1Collected);
    player2Score = calculateScore(player2Collected);

    document.getElementById('player1-score').textContent = `Player 1 Score: ${player1Score}`;
    document.getElementById('player2-score').textContent = `Player 2 Score: ${player2Score}`;
}

function calculateScore(collectedCards) {
    const cardValues = collectedCards.map(card => card.value);
    const jackOfDiamonds = collectedCards.find(card => card.value === 'J' && card.suit === 'diamonds');
    const sevenOfHearts = collectedCards.find(card => card.value === '7' && card.suit === 'hearts');
    const tenOfDiamonds = collectedCards.find(card => card.value === '10' && card.suit === 'diamonds');

    let score = 0;
    score += (jackOfDiamonds ? 1 : 0) + (sevenOfHearts ? 1 : 0) + (tenOfDiamonds ? 1 : 0);
    return score;
}

function endRound() {
    updateScores();
    const message = player1Score > player2Score ? 'Player 1 wins the round!' :
        player2Score > player1Score ? 'Player 2 wins the round!' :
            'The round is a tie!';
    alert(message);
}

});
