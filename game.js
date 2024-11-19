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

    // Initialize hands and middle cards
    dealInitialCards();

    // Display cards
    displayCards('player1-cards', player1Hand);
    displayCards('player2-cards', player2Hand);
    displayCards('middle-cards-container', middleCards);
    displayCollectedCards('player1-collected', player1Collected);
    displayCollectedCards('player2-collected', player2Collected);

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
        cardElement.setAttribute('data-value', card.value); // إضافة data-value
        cardElement.innerHTML = `
            <div class="top-left">${card.value}<br>${suitSymbols[card.suit]}</div>
            <div class="symbol">${suitSymbols[card.suit]}</div>
            <div class="bottom-right">${card.value}<br>${suitSymbols[card.suit]}</div>
        `;
        container.appendChild(cardElement);
    });
}

    function displayCollectedCards(elementId, cards) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card collected-card';
            cardElement.style.top = `${index * 2}px`;
            cardElement.style.left = `${index * 2}px`;
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

    const cardValueInt = cardValueToInt(card.value);

    // Find all possible summing combinations
    const possibleCombinations = findAllSummingCombinations(middleCards, cardValueInt);

    if (possibleCombinations.length > 0) {
        // Highlight the cards in the middle that can be chosen
        highlightCombinationCards(possibleCombinations);
    } else {
        // إذا لم يكن هناك أي مطابقة، أضف البطاقة إلى الوسط
        middleCards.push(card);
        displayCards('middle-cards-container', middleCards);
    }

    // Allow the player to take all matching or summing cards
    if (possibleCombinations.length > 0) {
        possibleCombinations[0].forEach(mc => {
            const index = middleCards.findIndex(c => c.value === mc.value && c.suit === mc.suit);
            if (index > -1) middleCards.splice(index, 1);
            playerCollected.push(mc); // Add middle card to collected cards
        });

        // Add the played card to the player's collected cards
        playerCollected.push(card);

        // Update the last player to take cards
        lastPlayerToTake = currentPlayer;

        // Display updated collected cards
        displayCollectedCards(`player${currentPlayer}-collected`, playerCollected);

        // Display "شكبـّة" if no cards left in the middle
        if (middleCards.length === 0) {
            alert("شكبـّة!");
        }
    }

    // Display updated middle cards
    displayCards('middle-cards-container', middleCards);

    // Switch turn to the other player
    currentPlayer = currentPlayer === 1 ? 2 : 1;

    // Display updated hands
    displayCards('player1-cards', player1Hand);
    displayCards('player2-cards', player2Hand);

    // Deal new cards if both players are out of cards
    if (player1Hand.length === 0 && player2Hand.length === 0 && deck.length > 0) {
        dealNewCards();
        displayCards('player1-cards', player1Hand);
        displayCards('player2-cards', player2Hand);
    }

    // If no more cards in the deck and hands, give the remaining middle cards to the last player to take cards
    if (deck.length === 0 && player1Hand.length === 0 && player2Hand.length === 0) {
        if (lastPlayerToTake === 1) {
            player1Collected.push(...middleCards);
            middleCards.length = 0; // Clear middle cards
        } else if (lastPlayerToTake === 2) {
            player2Collected.push(...middleCards);
            middleCards.length = 0; // Clear middle cards
        }
        displayCollectedCards('player1-collected', player1Collected);
        displayCollectedCards('player2-collected', player2Collected);
        displayCards('middle-cards-container', middleCards);
    }
}

function findAllSummingCombinations(cards, targetValue) {
    const results = [];

    function findCombination(currentCombination, remainingCards, currentSum) {
        if (currentSum === targetValue) {
            results.push([...currentCombination]);
            return;
        }
        if (currentSum > targetValue || remainingCards.length === 0) return;

        for (let i = 0; i < remainingCards.length; i++) {
            findCombination([...currentCombination, remainingCards[i]], remainingCards.slice(i + 1), currentSum + cardValueToInt(remainingCards[i].value));
        }
    }

    findCombination([], cards, 0);
    return results;
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
            default: return 0;
        }
    }

    function findSummingCards(cards, targetValue) {
        const result = [];
        function findCombination(currentCombination, remainingCards, currentSum) {
            if (currentSum === targetValue) {
                result.push([...currentCombination]);
                return;
            }
            if (currentSum > targetValue || remainingCards.length === 0) return;

            for (let i = 0; i < remainingCards.length; i++) {
                findCombination([...currentCombination, remainingCards[i]], remainingCards.slice(i + 1), currentSum + cardValueToInt(remainingCards[i].value));
            }
        }

        findCombination([], cards, 0);
        return result.length > 0 ? result[0] : [];
        // Return the first valid combination found
}
});